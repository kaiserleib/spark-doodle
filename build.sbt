name := "spark-doodle"

version := "current"

libraryDependencies ++= Seq(
  "com.sparkjava" % "spark-core" % "2.3"
)

autoScalaLibrary := false

publishMavenStyle := true

crossPaths := false

mainClass in (Compile, run) := Some("doodle.Application")
