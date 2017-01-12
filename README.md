# BRID-Verwalter
Ein einfacher node.js-Microservice zur Verwaltung von BRIDs (**BR**oadcast-**ID**) für das  [BMF](http://bmf.irt.de/ "BMF")-Datenmodell der IRT.

**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*


- [Formatdefinition für die eindeutige ID](#formatdefinition-für-die-eindeutige-id)
	- [domain](#domain)
	- [object_type](#object_type)
	- [use_type](#use_type)
	- [uuid](#uuid)
- [Datenmodell hinter der BRID](#datenmodell-hinter-der-brid)
	- [Liste der Metadaten zur Erzeugung](#liste-der-metadaten-zur-erzeugung)
	- [Finales Datenmodell](#finales-datenmodell)
- [Ablauf](#ablauf)
- [TODO](#todo)

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
| episode | Folge |
| program | Sendung |
| item | Beitrag |
| contract | Vertrag |
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

(Vorläufige Liste. Wird später als Service über ein JSON-File implementiert.)

### use_type
Was für ein BMF-Objekt wird referenziert.


| use_type | Beschreibung |
| -------- | ------------ |
| content_program | Inhaltsobjekt Sendung |
| content_item | Inhaltsobjekt Beitrag |
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
* Domain
* Object_Type
* Use_Type
* Titel
* Ansprechpartner
    * Funktion wie z.B. Autor, Redakteur
    * Vorname
    * Nachname
* Produktionsnummer
* Kostenstelle
* Kostenträger
* Ressort
* Redaktion/Organisationseinheit
* System (Das System, dass die ID haben will)
* ID_internal (ID im System)


### Finales Datenmodell
Das hier bekomme ich, wenn ich eine BRID abfrage

```json
{
    "brid": "string",
		"domain":"string",
		"object_type": "string",
		"use_type":"string",
		"uuid":"string",
		"title": "string",
    "ansprechpartner": {
        "function":"string, zB Redakteur, Autor",
        "vorname":"string",
        "nachname":"string"       
    },
    "produktionsnummer":"string",
    "kostenstelle":"string",
    "kostentraeger":"string",
    "ressort":"string",
    "organisationseinheit":"string",
    "instanzen": [
        {
            "system":"string, Name des Systems (zB WON)",
            "id":"string, ID im System",
            "description":"string, Beschreibung der Instanz"            
        }
    ],
    "anmerkung":"string"
}
```

## Ablauf
Ich setze einen http-POST auf die Route /v2/brid mit den Metadaten als Objekt ab.
Als Antwort bekomme ich eine HTTP 200 oder 201 mit der BRID.
* 200 wenn es die ID schon gibt. Dann werden meine ID-informationen in den Instanzen angehängt
* 201 wenn eine neue BRID erzeugt wurde. Auch dann werden meine ID-informationen in den Instanzen angehängt

Nun kann ich jederzeit unter /v2/brid/[BRID] abfragen, was für Daten es zur Brid gibt.
