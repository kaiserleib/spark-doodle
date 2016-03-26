name := "spark-doodle"

version := "current"

libraryDependencies ++= Seq(
  "com.sparkjava" % "spark-core" % "2.3"
)

autoScalaLibrary := false

publishMavenStyle := true

crossPaths := false

enablePlugins(JavaAppPackaging)

mainClass in (Compile, run) := Some("doodle.Application")

herokuAppName in Compile := "hidden-inlet-14409"