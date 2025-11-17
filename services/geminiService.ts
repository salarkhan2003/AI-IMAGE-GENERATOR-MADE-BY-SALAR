export const editImage = async (images: { base64Data: string | null; mimeType: string | null }[], prompt: string): Promise<string> => {
  if (!process.env.SAMBA_NOVA_API_KEY) {
    throw new Error("SAMBA_NOVA_API_KEY environment variable is not set.");
  }

  // Prepare the messages array
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: prompt
        }
      ]
    }
  ];

  // Add image data to the content if available
  for (const image of images) {
    if (image.base64Data && image.mimeType) {
      // Remove the data URL prefix if present
      const base64Data = image.base64Data.replace(/^data:image\/\w+;base64,/, '');
      
      (messages[0].content as any[]).push({
        type: "image_url",
        image_url: {
          url: `data:${image.mimeType};base64,${base64Data}`
        }
      });
    }
  }

  // Prepare the request body
  const requestBody = {
    stream: false, // Set to false to get a complete response instead of streaming
    model: "Llama-4-Maverick-17B-128E-Instruct",
    messages: messages
  };

  try {
    const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SAMBA_NOVA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response content
    const content = data.choices?.[0]?.message?.content || "Response received from SambaNova API";
    
    // Since the model doesn't generate images directly, we'll create a base64 representation
    // of a placeholder image with the text response embedded as metadata
    // In a real implementation, you might want to use a different approach
    const placeholderSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
        <rect width="512" height="512" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#333" text-anchor="middle" dominant-baseline="middle">
          <![CDATA[${content.substring(0, 100)}]]>
        </text>
      </svg>
    `;
    
    // Convert SVG to base64
    const svgBase64 = btoa(placeholderSvg);
    return svgBase64;
    
  } catch (error) {
    console.error("SambaNova API call failed:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate response: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the SambaNova API.");
  }
};