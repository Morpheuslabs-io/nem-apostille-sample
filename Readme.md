# Catapult Wallet

`visit localhost:3000/catapult`

**In private Catapult Blockchain Fees is not required**

1. Showing Account Infomation.
2. Pull latest 10 transaction.
3. Make transaction such as sent Xem or Message.

## some services on Catapult.

`api.get('/generateaccount', catapultService.generateAccount)`
Account Generation

`api.get('/hash/:tx', catapultService.getTransactionByHash)`
Retrieve transaction by hash

`api.get('/account/:address', catapultService.getAccountStatus);`

# Apostiile

`visit localhost:3000/apostille`

There is 3 tabs, Create, Download and Audit.

**Create Tab**
pload a file and perform apostille the file.

**Download Tab**
List all uploaded and apostilled files.
file format : {filename}-{tx hash}.{extension}

**Audit Tab**
upload apostilled File to perform audit.
file format required: {filename}-{tx hash}.{extension}

### Instructions

1. Create a file called `cert.txt`, and type content `cgpa=2`.
2. Click on **Create Tab** and upload the `cert.txt` file.
3. Once upload successful, you will see the message with transaction hash (tx).
4. Click on **Download Tab**, you will to found the file and name `cert-{tx}.txt`.
5. Click on `cert-{tx}.txt` it will download in your pc.
6. Time to test on Audit, Click on **Audit Tab**, and upload `cert-{tx}.txt` (the file you was downloaded).
7. Expected Result : it will return `Audit Successful`.
8. open `cert-{tx}.txt` and edit the content from `cgpa=2` to `cgpa=4`.
9. Try audit again with edited `cert-{tx}.txt`.
10. Expected Result: `Audit Fail!!!`
