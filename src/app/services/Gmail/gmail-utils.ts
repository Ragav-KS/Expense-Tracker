export class GmailUtils {
  public static getContentFromMessage(message: gapi.client.gmail.Message): {
    date: string;
    subject: string;
    body: string;
  } {
    let headers = new Map();
    message.payload?.headers!.forEach((header) => {
      headers.set(header.name, header.value);
    });

    let mailDate = headers.get('Date');
    let subject = headers.get('Subject');

    let payload = message.payload!;

    let mime = payload.mimeType;

    let decodedBody: string;
    if (mime?.includes('multipart')) {
      let parts = payload.parts!;
      let body = parts[0].body!.data!;
      decodedBody = atob(body.replace(/-/g, '+').replace(/_/g, '/'));
    }

    return {
      date: mailDate,
      subject: subject,
      body: decodedBody!,
    };
  }
}
