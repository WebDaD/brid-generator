# BRID-Verwalter
Ein einfacher node.js-Microservice zur Verwaltung von BRIDs (**BR**oadcast-**ID**) für das  [BMF](http://bmf.irt.de/ "BMF")-Datenmodell der IRT.

**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [BRID-Verwalter](#)
	- [Formatdefinition für die eindeutige ID](#)
		- [domain](#)
		- [object_type](#)
		- [use_type](#)
		- [uuid](#)
	- [Datenmodell hinter der BRID](#)
		- [Liste der Metadaten zur Erzeugung](#)
		- [Finales Datenmodell](#)
	- [Ablauf](#)
- [TODO](#)

## Formatdefinition für die eindeutige ID

**brid://[domain]/[object_type]/[use_type]/[uuid]**


### domain
Spezifisch für die erstellende Rundfunkanstalt.



| Domain | Langform |
| ------ | -------- |
| br.de  | Bayerischer Rundfunk |

### object_type
Alle Formen von Geschäftsobjekten.

Ein Geschäftsobjekt beschreibt die Produkte/Inhalte/Content/Events, in denen sich das
Programmvermögen des BR manifestiert.


| object | Beschreibung |
| ------ | ------------ |
| series | Serie |
| episode | Sendungen |
| contribution | Beiträge |
| contract | Verträge |
| cutlist | Schnittliste |
| musiclist | Musikliste |
| article | Artikel |
| script | Manuskript |
| picture | Foto |
| dossier | Dossier |
| mediabox | Mediaboxen |
| infografic | Infografiken |
| animation | Animationen |
| app | Apps |
| mediathek | Mediatheken |

### use_type
Was für ein BMF-Objekt wird referenziert.


| use_type | Beschreibung |
| -------- | ------------ |
| content_series | Inhaltsobjekt Sendung |
| content_contribution | Inhaltsobjekt Beitrag |
| story | Story aus weConnect |
| distribution | Veröffentlichungsobjekt |
| service | Serviceobjekt |
| multimedia | Multimediaobjekt |
| grouping | Gruppierungsobjekt (Serie etc.) |
| resource| Ressource |
| resource_management| RessourcenManagement |


### uuid
UUID basiert nicht auf System-ID, sondern ist abstrakt
Ein UUID besteht aus einer 16-Byte-Zahl, die hexadezimal notiert wird. (siehe [https://tools.ietf.org/html/rfc4122](https://tools.ietf.org/html/rfc4122))
In diesem Fall werden die trennenden Bindestriche gelöscht.

## Datenmodell hinter der BRID
Zu jeder BRID gibt es einen eineindeutig beschreibenden Metadatensatz.
Pro BRID werden außerdem mehrere System-IDs referenziert.

Das heißt, für jede BRID gibt es referenziert ein oder mehrere Planungsobjekte, mehrere Fassungen als Essenzen (Audio/Video), zugeordnete andere Essenzen (z.B. Bild), mehrere Distributionen, ...

### Liste der Metadaten zur Erzeugung
Mit diesen Daten bekomme ich eine BRID
* Titel
* Ansprechpartner
    * Rolle
    * Vorname
    * Nachname
* Produktionsnummer
* Kostenstelle
* Kostenträger
* Ressort
* Redaktion
* System (Das System, dass die ID haben will)
* ID (ID im System)


### Finales Datenmodell
Das hier bekomme ich, wenn ich eine BRID abfrage

```json
{
    "brid": "string",
    "title": "string",
    "ansprechpartner": {
        "rolle":"string, zB Redakteur, Autor",
        "vorname":"string",
        "nachname":"string"       
    },
    "produktionsnummer":"string",
    "kostenstelle":"string",
    "kostentraeger":"string",
    "ressort":"string",
    "redaktion":"string",
    "instanzen": [
        {
            "system":"string, Name des Systems (zB WON)",
            "id":"string, ID im System",
            "description":"string, Beschreibung der Instanz"            
        }
    ]
}
```

## Ablauf
Ich setze einen http-POST auf die Route /v2/brid mit den Metadaten als Objekt ab.
Als Antwort bekomme ich eine HTTP 200 oder 201 mit der BRID.
* 200 wenn es die ID schon gibt. Dann werden meine ID-informationen in den Instanzen angehängt
* 201 wenn eine neue BRID erzeugt wurde. Auch dann werden meine ID-informationen in den Instanzen angehängt

Nun kann ich jederzeit unter /v2/brid/[BRID] abfragen, was für Daten es zur Brid gibt.


# TODO
* Speicherung der Daten
* Abfrage der Daten
* Listen für BRID als API-Pfad
* Unittests
* Automatische Integrationstests
* Testreporting
* Randomized Data Tests
* Lasttests
* Build-Helper
* API-Dokumentation mit RAML