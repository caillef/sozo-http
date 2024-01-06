const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { exec } = require('child_process');

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ACCOUNTS = [
    {
      "account": "0x5686a647a9cdd63ade617e0baf3b364856b813b508f03903eb58a7e622d5855",
      "private": "0x33003003001800009900180300d206308b0070db00121318d17b5e6262150b",
      "public": "0x4c0f884b8e5b4f00d97a3aad26b2e5de0c0c76a555060c837da2e287403c01d"
    },
    {
      "account": "0x765149d6bc63271df7b0316537888b81aa021523f9516a05306f10fd36914da",
      "private": "0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b",
      "public": "0x4c339f18b9d1b95b64a6d378abd1480b2e0d5d5bd33cd0828cbce4d65c27284"
    },
    {
      "account": "0x5006399928dad095cc39818cae15dc022592d47d883701e7814c9db19e96efc",
      "private": "0x736adbbcdac7cc600f89051db1abbc16b9996b46f6b58a9752a11c1028a8ec8",
      "public": "0x570258e7277eb345ab80803c1dc5847591efd028916fc826bc7cd47ccd8f20d"
    },
    {
      "account": "0x586364c42cf7f6c968172ba0806b7403c567544266821c8cd28c292a08b2346",
      "private": "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a",
      "public": "0x640466ebd2ce505209d3e5c4494b4276ed8f1cde764d757eb48831961f7cdea"
    },
    {
      "account": "0x70038d685013781745f0ac6fe44f23465f9c55a836fceb119b0d7d379f21026",
      "private": "0x283d1e73776cd4ac1ac5f0b879f561bded25eceb2cc589c674af0cec41df441",
      "public": "0x73c8a29ba0e6a368422d0551b3f45a30a27166b809ba07a41a1bc434b000ba7"
    },
    {
      "account": "0x5ae5b8925c1568f3ec6ab5f4d4ea4b5467e6d6a18f0944608a0d368ac15bdc7",
      "private": "0x3e3979c1ed728490308054fe357a9f49cf67f80f9721f44cc57235129e090f4",
      "public": "0x1e8965b7d0b20b91a62fe515dd991dc9fcb748acddf6b2cf18cec3bdd0f9f9a"
    },
    {
      "account": "0x456b9e6dbbfbfc59e23a80e5ff5ecc59bc02c3c5b9c78ab667471f52c018e87",
      "private": "0x6bf3604bcb41fed6c42bcca5436eeb65083a982ff65db0dc123f65358008b51",
      "public": "0x4b076e402835913e3f6812ed28cef8b757d4643ebf2714471a387cb10f22be3"
    },
    {
      "account": "0x5c47b38f788ec9d382b5079165bc96c0f49647250199a78d34c436d54d12217",
      "private": "0x14d6672dcb4b77ca36a887e9a11cd9d637d5012468175829e9c6e770c61642",
      "public": "0x16e375df37a7653038bd9eccd767e780c2c4d4c66b4c85f455236a3fd75673a"
    },
    {
      "account": "0x74bfdb5562f91764fddbbf3f4fb322de114a00d6d6889b19a4dd7b45d5ba24d",
      "private": "0xc5b2fcab997346f3ea1c00b002ecf6f382c5f9c9659a3894eb783c5320f912",
      "public": "0x33246ce85ebdc292e6a5c5b4dd51fab2757be34b8ffda847ca6925edf31cb67"
    }
  ]
  

let currentId = 0

app.get('/id', (req, res) => {
    const id = currentId
    currentId++
    res.send(id)
})

// Basic route
app.get('/sozo/execute/:id', (req, res) => {
    const { id } = req.params
    const {
        contract, selector, calldata
    } = req.query

    const account = ACCOUNTS[id]
    let sozoQuery = "sozo execute " + contract + " " + selector
    if (calldata) {
        sozoQuery += " --calldata " + calldata
    }
    sozoQuery += ` --private-key ${account.private} --account-address ${account.account}`
    exec(sozoQuery, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
    });
});

// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// General error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

