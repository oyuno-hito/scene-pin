buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.flywaydb:flyway-database-postgresql:10.20.1")
        classpath("org.postgresql:postgresql:42.7.4")
    }
}

plugins {
    kotlin("jvm") version "1.9.25" apply false
    kotlin("plugin.spring") version "1.9.25" apply false
    kotlin("plugin.jpa") version "1.9.25" apply false
    id("org.springframework.boot") version "3.3.5" apply false
    id("io.spring.dependency-management") version "1.1.6" apply false
    id("org.flywaydb.flyway") version "10.20.1"
}

flyway {
    url = System.getProperty("flyway.url") ?: "jdbc:postgresql://localhost:5433/scenepin"
    user = System.getProperty("flyway.user") ?: "scenepin"
    password = System.getProperty("flyway.password") ?: "scenepin"
    locations = arrayOf("filesystem:migration/src/main/resources/db/migration")
    cleanDisabled = false
}

allprojects {
    group = "com.scenepin"
    version = "0.0.1-SNAPSHOT"

    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "kotlin")

    tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict")
            jvmTarget = "21"
        }
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }
}
