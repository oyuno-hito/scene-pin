package com.scenepin.api.config

import com.scenepin.infra.storage.StorageProperties
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.nio.file.Paths

@Configuration
class WebConfig(
    private val storageProperties: StorageProperties
) : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOriginPatterns("*")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
    }

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        val thumbnailPath = Paths.get(storageProperties.thumbnailPath).toAbsolutePath().toString()

        registry.addResourceHandler("/thumbnails/**")
            .addResourceLocations("file:$thumbnailPath/")
    }
}
