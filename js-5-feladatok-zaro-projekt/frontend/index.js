const fs = require('fs');

const fromFile = process.argv[2];
const toFile = process.argv[3];
const regext = /.*\.json$/

const convertUser = user =>
  ({
    id: user.id,
    name: user.name,
    emailAddress: user.emailAddress,
    address: `${user.address.country || ''}, ${user.address.region || ''} ${user.address.city || ''}, ${user.address.streetaddress || ''}, ${user.address.postalcode || ''}`,
  });

const convert = () => {
  fs.readFile(fromFile, 'utf8', function (err, data) {
    if (err) return console.log(err);
    fs.writeFile(toFile,
      JSON.stringify({
        users: JSON.parse(data).map(user => convertUser(user)),
      }),
      function (err) {
        if (err) return console.log(err);
        console.log('conversion done.');
      });
  });
}

if (regext.test(fromFile) && regext.test(toFile))
  convert();
else
  console.log(`file extension error! "${fromFile}" "${toFile}"`);