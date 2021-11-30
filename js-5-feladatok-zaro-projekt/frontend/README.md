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

A különböző nyelvekhez (jelenleg magyar és angol) tartozó fordítások, melyek a DOM-ban és a translateStrings objektumban történnek, a `localization/lang.json` fájlban vannak. Ha módosítani kell, vagy más nyelvekhez is kellene ilyent készíteni akkor a 

http://localhost:5500/#langObjSave

megnyitásával a böngészőben a honlap normál betöltődése mellett letöltődik a `lang.json` fájl is (értelemszerűen a host és a port az aktuális szerver). Ez abban különbözik a `localization/lang.json` fájltól, hogy ennek első objektuma, ami az honlap eredeti nyelvét tartalmazza az aktuális honlapból van generálva, így ha a honlap változik, ennek a segítségével lehet a fordításokat is megcsinálni, és az új `localization/lang.json` fájlt elkészíteni. Majd kellene egy "merge" script (node.js-ben) ami a honlap változásaira után a fordítást megkönnyíti, jelenleg ugyanis a honlap változásaival a DOM azonosító string-jei megváltoz(hat)nak, és így a meglévő fordítások sem fognak működni, amit jelenleg most csak "kézzel" lehet orvolsolni.