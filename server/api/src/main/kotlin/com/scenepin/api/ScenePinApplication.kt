package com.scenepin.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@SpringBootApplication(scanBasePackages = ["com.scenepin"])
@ConfigurationPropertiesScan(basePackages = ["com.scenepin"])
class ScenePinApplication

fun main(args: Array<String>) {
    runApplication<ScenePinApplication>(*args)
}
