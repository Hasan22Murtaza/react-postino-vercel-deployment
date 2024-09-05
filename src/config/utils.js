export const getDefaultSingleRequest = () => ({
  url: "",
  type: "GET",
  collection_id: "",
  name: "",
  order_by: "",
  header: [{ selected: true, key: "", value: "" }],
  params: [{ selected: true, type: "Text", key: "", value: "" }],
  response: null,
  response_raw: null,
  response_html: null,
  raw_data: null,
});

export const downloadJsonFile = async (url, filename) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to download file", error);
      // Optionally, show a message to the user
    }
  };
  
  