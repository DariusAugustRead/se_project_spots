export default class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "25368a64-c8d2-4008-924d-9ac1b10e3eac",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

// export the class
