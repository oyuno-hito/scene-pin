package com.scenepin.infra.storage

import com.github.kokorin.jaffree.ffmpeg.FFmpeg
import com.github.kokorin.jaffree.ffmpeg.UrlInput
import com.github.kokorin.jaffree.ffmpeg.UrlOutput
import com.github.kokorin.jaffree.ffprobe.FFprobe
import org.springframework.stereotype.Service
import java.io.InputStream
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.UUID

data class VideoProcessResult(
    val videoPath: String,
    val thumbnailPath: String,
    val duration: Long,
    val fileSize: Long
)

@Service
class VideoStorageService(
    private val storageProperties: StorageProperties,
    private val compressionProperties: CompressionProperties,
    private val thumbnailProperties: ThumbnailProperties
) {
    private val videoDir: Path = Paths.get(storageProperties.videoPath)
    private val thumbnailDir: Path = Paths.get(storageProperties.thumbnailPath)

    init {
        Files.createDirectories(videoDir)
        Files.createDirectories(thumbnailDir)
    }

    fun processAndSave(inputStream: InputStream): VideoProcessResult {
        val id = UUID.randomUUID().toString()
        val tempFile = Files.createTempFile("upload_", ".tmp")

        try {
            Files.copy(inputStream, tempFile, StandardCopyOption.REPLACE_EXISTING)

            val videoFileName = "$id.mp4"
            val thumbnailFileName = "$id.jpg"
            val videoPath = videoDir.resolve(videoFileName)
            val thumbnailPath = thumbnailDir.resolve(thumbnailFileName)

            if (compressionProperties.enabled) {
                compressVideo(tempFile, videoPath)
            } else {
                Files.copy(tempFile, videoPath)
            }

            generateThumbnail(videoPath, thumbnailPath)

            val duration = getVideoDuration(videoPath)
            val fileSize = Files.size(videoPath)

            return VideoProcessResult(
                videoPath = videoFileName,
                thumbnailPath = thumbnailFileName,
                duration = duration,
                fileSize = fileSize
            )
        } finally {
            Files.deleteIfExists(tempFile)
        }
    }

    private fun compressVideo(input: Path, output: Path) {
        FFmpeg.atPath()
            .addInput(UrlInput.fromPath(input))
            .addOutput(
                UrlOutput.toPath(output)
                    .addArguments("-vf", "scale='min(${compressionProperties.maxWidth},iw)':-2")
                    .addArguments("-c:v", compressionProperties.codec)
                    .addArguments("-crf", compressionProperties.crf.toString())
                    .addArguments("-preset", "medium")
                    .addArguments("-c:a", "aac")
                    .addArguments("-b:a", "128k")
                    .addArguments("-movflags", "+faststart")
            )
            .execute()
    }

    private fun generateThumbnail(videoPath: Path, thumbnailPath: Path) {
        FFmpeg.atPath()
            .addInput(UrlInput.fromPath(videoPath))
            .addOutput(
                UrlOutput.toPath(thumbnailPath)
                    .addArguments("-ss", "00:00:01")
                    .addArguments("-vframes", "1")
                    .addArguments("-vf", "scale=${thumbnailProperties.width}:${thumbnailProperties.height}:force_original_aspect_ratio=decrease,pad=${thumbnailProperties.width}:${thumbnailProperties.height}:(ow-iw)/2:(oh-ih)/2")
                    .addArguments("-q:v", "2")
            )
            .setOverwriteOutput(true)
            .execute()
    }

    private fun getVideoDuration(videoPath: Path): Long {
        return try {
            val probe = FFprobe.atPath()
                .setInput(videoPath)
                .setShowFormat(true)
                .execute()

            val format = probe.data.javaClass.getMethod("getFormat").invoke(probe.data)
            val duration = format?.javaClass?.getMethod("getDuration")?.invoke(format) as? Double ?: 0.0

            (duration * 1000).toLong()
        } catch (e: Exception) {
            0L
        }
    }

    fun getVideoPath(fileName: String): Path = videoDir.resolve(fileName)

    fun getThumbnailPath(fileName: String): Path = thumbnailDir.resolve(fileName)

    fun deleteVideo(videoFileName: String, thumbnailFileName: String) {
        Files.deleteIfExists(videoDir.resolve(videoFileName))
        Files.deleteIfExists(thumbnailDir.resolve(thumbnailFileName))
    }
}
