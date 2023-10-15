export function isVideoURL(url: string) {
  // Define an array of video file extensions to check
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".wmv",
    ".flv",
    ".webm",
    ".3gp",
  ]

  // Extract the file extension from the URL
  const fileExtension = url.split(".").pop()

  // Check if the file extension is in the list of video extensions
  return videoExtensions.includes("." + fileExtension)
}
