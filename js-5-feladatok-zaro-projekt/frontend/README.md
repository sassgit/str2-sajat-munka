Egy CRUD alkalmazás (js/HTML5), egy JSON-fájlt használ adatforrásként (json-server, 3000-es port), amely 100 felhasználó adatait (id, name, emailAddress, address) tartalmazza.

A függőségek (node_modules, és így az axios) nincsenek a repo-ban.

Függőségek telepítése: 

```
npm install
```


A [Mockaroo](https://mockaroo.com/) oldalról nyert adatokat szükséges konvertálni, mert ott nem lehet generálni olyan address-mezőt, amely tartalmazza az országot/régiót/várost is. A konvertálás során az adatokon végzett hozzáadások/módosítások/törlések elvesznek, újra az eredeti adatbázist kapjuk meg. Az eredeti és a konvertált adatok is a `../backend/` mappában vannak.

100 db user kovnertálása (javasolt futtatni git add/commit előtt):

```
npm run convert
```

Az 1000 user-es adatbázis konvertálása:
```
npm run convert1k
```

json-server indítása:
```
npm test
```
