export async function decodeBase64Images(inputData: string): Promise<string[]> {
  // Regex untuk mencocokkan string base64 dalam format data URL
  const base64Regex = /data:image\/[a-zA-Z]+;base64,([^"]+)/g

  // Ekstrak semua string base64 dari input
  const base64Matches = inputData.match(base64Regex) || []

  const decodedImages = await Promise.all(
    base64Matches.map(async (base64String) => {
      try {
        // base64String sudah dalam format data URL, jadi bisa langsung digunakan
        return base64String
      } catch (error) {
        console.error("Error processing base64 string:", error)
        return ""
      }
    }),
  )

  return decodedImages.filter((url) => url !== "")
}

