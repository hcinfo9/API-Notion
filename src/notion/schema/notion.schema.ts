export function NotionSchema(body: Record<string, any>) {
  const notionPayload = {
    Company: {
      title: [{ text: { content: body.company || '' } }],
    },
    Campaign: {
      rich_text: [{ text: { content: body.campaign || '' } }],
    },
    Description: {
      rich_text: [{ text: { content: body.description || '' } }],
    },
    PlannedDate: {
      date: body.plannedDate
        ? {
            start: new Date(body.plannedDate).toISOString().split('T')[0] || '',
          }
        : null,
    },
    Where: {
      rich_text: [{ text: { content: body.where || '' } }],
    },
    Language: {
      select: body.language ? { name: body.language } : null,
    },
    Content: {
      rich_text: [{ text: { content: body.content || '' } }],
    },
    Image: {
      files: body.image
        ? [
            {
              type: 'external',
              name: 'Image',
              external: { url: body.image },
            },
          ]
        : [],
    },
    'image content': {
      rich_text: [{ text: { content: body['image-content'] || '' } }],
    },
  };

  if (body.properties?.language && !body.properties.language.select) {
    body.properties.language.select = {
      id: '',
      name: '',
    };
    notionPayload.Language.select = {
      name: '',
    };
  } else if (!body.properties?.language) {
    notionPayload.Language.select = null;
  }

  if (!body.properties?.PlannedDate || !notionPayload.PlannedDate?.date) {
    if (
      body.properties?.PlannedDate &&
      typeof body.properties?.PlannedDate === 'object'
    ) {
      body.properties.PlannedDate.date = '';
      notionPayload.PlannedDate = {
        date: {
          start: '',
        },
      };
    }
  }
  return notionPayload;
}
