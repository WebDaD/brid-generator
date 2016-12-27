# BRID-Generator

## v2
* to get a BRID, post some metadata to /v2/brid
  * title
  * segment
  * domain
  * author
* have a little "database"
  * jsonfile
  * array with objects
    * brid
    * metadata
* on brid post
  * check database if our metadata are already there
  * then send the brid or create a new one to save in the database

## production release
* interchangable database
* tests
* docs
* 