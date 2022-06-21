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

   `:id`corresponds to a MongoDB ID

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
