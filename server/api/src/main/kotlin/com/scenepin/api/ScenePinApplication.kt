package com.scenepin.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(scanBasePackages = ["com.scenepin"])
class ScenePinApplication

fun main(args: Array<String>) {
    runApplication<ScenePinApplication>(*args)
}
