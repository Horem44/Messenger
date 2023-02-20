export class ApiClient {
  private readonly baseUrl = "http://localhost:8080/";

  get(urlPart: string) {
    return fetch(this.baseUrl + urlPart, {
      method: "GET",
      credentials: 'include',
    });
  }

  post(urlPart: string, body: unknown) {
    return fetch(this.baseUrl + urlPart, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });
  }

  postFormData(urlPart: string, body: FormData) {
    return fetch(this.baseUrl + urlPart, {
      method: "POST",
      credentials: 'include',
      body: body,
    });
  }

  delete(urlPart: string) {
    return fetch(this.baseUrl + urlPart, {
      method: "DELETE",
      credentials: 'include',
    });
  }
}