# 2022-March-Gifti-backend

----
## API Documentation

----
### Create a new event in the collection

* **URL**

  `/events`

* **Method:**

  `POST` 

* **Data Params**

  * **Body:** `{ event_name : string, deadline : string }`

* **Success Response:**

    * **Code:** 200 <br />
      **Content:** <br />
    ```json
      {
        "status": "200",
        "message": "Document added successfully",
        "data": {
                  "id": "62b19bdfa0fff7ad7f39c98a"
                }
      }
    ```

    

* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />
      **Content:** <br />
    ```json
      {
        "status": "400",
        "message": "Failed to add document",
        "data": null
      }
    ```

----
### Returns all information about a single event

* **URL**

  `/events/:id`

* **Method:**

  `GET`

* **URL Params**

   `:id`corresponds to a MongoDB ID for an event

* **Success Response:**

    * **Code:** 200 <br />
      **Content:** <br />
    ```json
      {
        "status": "200",
        "message": "Event retrieved successfully",
        "data": {
                  "_id": "62b19bdfa0fff7ad7f39c98a",
                  "event_name": "Halloween",
                  "deadline": "01/11/2022",
                  "participants": []
                }
      }
    ```



* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />
      **Content:** <br />
    ```json
      {
        "status": "400",
        "message": "Invalid ID",
        "data": null
      }
    ```

----
### Fetches all participants from a given event

* **URL**

  `/participants/:eventId`

* **Method:**

  `GET`

* **URL Params**

  `:eventId`corresponds to a MongoDB ID for the event the participant is to be added to

* **Success Response:**

    * **Code:** 200 <br />
      **Content:** <br />
    ```json
      {
        "status": "200",
        "message": "Successfully retrieved participants",
        "data": {
                  "participants": [
                    {
                      "id": "62b2f906f5b8b8a583af3f3f",
                      "name": "Steven Stevens",
                      "email": "krustydude@bikinibottom.org",
                      "address": {
                          "street": "Krusty Road",
                          "city": "Bikini Bottom",
                          "postcode": "BS8 4LY"
                        }
                    }
                  ]
                }
      }
    ```



* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />
      **Content:** <br />
    ```json
      {
        "status": "400",
        "message": "Invalid ID",
        "data": null
      }
    ```

----
### Adds a participant to an event

* **URL**

  `/participants/:eventId`

* **Method:**

  `POST`

* **URL Params**

  `:eventId`corresponds to a MongoDB ID for the event the participant is to be added to

* **Data Params**

    * **Body:** `{ name : string, email : string , ?address : {street : string, city : string, postcode : string}}`

* **Success Response:**

    * **Code:** 200 <br />
      **Content:** <br />
    ```json
      {
        "status": "200",
        "message": "Participant added",
        "data": {
                  "id": "62b19bdfa0fff7ad7f39c98a"
                }
      }
    ```



* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />
      **Content:** <br />
    ```json
      {
        "status": "400",
        "message": "Could not add participant",
        "data": null
      }
    ```

----