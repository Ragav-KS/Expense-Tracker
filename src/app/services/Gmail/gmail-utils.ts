export class GmailUtils {
  public static async getPayloadFromMail(
    message: gapi.client.gmail.Message
  ): Promise<{ date: string; subject: string; body: string }> {
    let headers = new Map();
    message.payload?.headers!.forEach((header) => {
      headers.set(header.name, header.value);
    });

    let mailDate = headers.get('Date');
    let subject = headers.get('Subject');

    let payload = message.payload!;

    let mime = payload.mimeType;

    let decodedBody: string;
    let body: string;
    if (mime?.includes('multipart')) {
      let parts = payload.parts!;
      body = parts[0].body!.data!;
    } else {
      body = payload.body!.data!;
    }

    decodedBody = atob(body!.replace(/-/g, '+').replace(/_/g, '/'));

    return {
      date: mailDate,
      subject: subject,
      body: decodedBody!,
    };
  }
}
