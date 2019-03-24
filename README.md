# ralph-google-maps-test-navagis

# Google Map API Integration (Ralph Tapac)

Description: This is a sample appliation based on the following requirements

* Plot restaurants across cebu
* layer panel can filter the restaurant type to show.
* Each restaurant can keep track of the number of customers that visited.
* Customers can get direction to the restaurant from current location.
* Draw a circle or rectangle on the map and and show the number of restaurants within the circle
or rectangle.
* Add any value adding feature like analytics to show relationships between patrons, restaurant
and revenue.

## Things to consider before running the sample app

Accessing the docker container is different from OS. Usually for Mac (OSX), the endpoints are accessed using
**http://MACHINE_IP:port/endpoint** while accssing endpoints of other OS environment is **http://localhost:port/endpoint**

Example:

- http://192.168.99.100:5000/test_endpoint (API backend test)
- http://192.168.99.100 (client app)

Configurations must also be considered:

- Please adjust GoogleMapTest/instance/config.py with
  `SQLALCHEMY_DATABASE_URI='mysql+mysqlconnector://root:navagis@<your ip address>/db_google_map_test'` (Mac OS)
  `SQLALCHEMY_DATABASE_URI='mysql+mysqlconnector://root:hipages@localhost/db_google_map_test'` (non-Mac OS)
- Please also adjust js/main_app.js: this.restEndpoint = <value should be your IP or localhost>
- You can reach my at rdtapac@gmail.com if you have questions regarding how to make the sample run

## Running the app

run `docker-compose up -d`. Access http://<MACHINE_IP>/ or http://localhost/

Additional python modules were included. if the `docker-compose up` was ran before, please run `docker-compose up -d --build --force-recreate` to rebuild the 
API image


## Things left to do (due to limited time):
- API Request Authentication mechanism for REST API (optional feature for demo)

## Additional Note

Please verify that all containers are running (there should be 3 containers running)
`docker ps`
