const bcrypt = require('bcrypt');

async function salt(req)
{
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(req, salt);
	return hash;
} 

module.exports = function auth(req)
{
	return salt(req);
}


