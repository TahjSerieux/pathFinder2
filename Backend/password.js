const bcrypt = require('bcrypt');

const createKey = async() =>{
    const preHash = '9493c4de8ede7b3378100ccfc0cc5ad3';
    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(preHash, salt);
    console.log(hash);


}
createKey();