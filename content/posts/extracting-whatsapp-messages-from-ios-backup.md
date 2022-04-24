---
title: "Extracting WhatsApp messages from an iOS backup"
date: 2022-04-24T06:20:49+05:00
draft: false
categories: ["programming", "python", "reverse-engineering", "ios"]
featured_image: "/images/exploring-ios-backup/hero.png"
teaser: "Have you ever been interested in how Apple saves the iOS backup files and how you can extract particular files from a backup? In this article, I will show you the different encryptions involved in creating an iOS backup, how to decrypt the data, and how to extract WhatsApp chats from an iOS backup."
---

Hi everyone! :wave: I was recently exploring how to get a local backup of WhatsApp messages from my iPhone. I switched from Android to iOS in the past and lost all of my WhatsApp messages. I wanted to make sure that if I switched again from iOS to Android I don't lose any messages. I don't really care if I can import the messages in WhatsApp. I just don't want to lose all of the important information I have in my chats. I don't have any immediate plans for switching (if ever) but it seemed like a fun challenge and so I started surveying the available tools and how they work.

This was mostly a learning exercise for me regarding how Apple stores iOS backups and how I can selectively extract information and data from one. My target was to have a local copy of WhatsApp messages that I can read and search through locally. It would be doubly awesome if I can move the messages to an Android device but, as I mentioned before, that wasn't my main aim.

### Exploring iOS backup

By default, when you create an iOS backup on Mac (Catalina in my case), it is stored under `~/Library/Application Support/MobileSync/Backup/`. This folder contains sub-folders with unique device identifiers. Each sub-folder is a backup and contains a bunch of additional subfolders along with the following 4 important files:

- `Info.plist`
- `Manifest.db`
- `Manifest.plist`
- `Status.plist`

We mainly care about both of the `Manifest` files. 

The `Manifest.plist` file is a binary Property List file that contains information about the backup. It contains:

- Backup keybag: The Backup keybag contains a set of data protection class keys that are different from the keys in the System keybag, and backed-up data is re-encrypted with the new class keys. Keys in the Backup keybag facilitate the secure storage of backups. We will learn about protection classes later
- Date: This is the timestamp of a backup created or last updated
- ManifestKey: This is the key used to encrypt Manifest.db (wrapped with protection class four)
- WasPasscodeSet: This identifies whether a passcode was set on the device when it was last synced
- And much more...

Source: [O'Reilly](https://www.oreilly.com/library/view/practical-mobile-forensics/9781788839198/6c69c5a8-5226-4211-916e-9a56fd7bdd2c.xhtml) + [Richinfante](https://www.richinfante.com/2017/3/16/reverse-engineering-the-ios-backup)

Whereas, the `Manifest.db` file contains all the juicy info about the files in the backup and their paths. The only problem is that the `Manifest.db` file is encrypted and we need to use the information from the `Manifest.plist` file to decrypt it. If the backup was not encrypted, we could have probably gotten away without making use of the `Manifest.plist` file.

We can verify that the db file is encrypted by opening it in any SQL db viewer. I used "[DB Browser for SQLite](https://sqlitebrowser.org/)" and it showed me this screen:

![SQLCipher Encryption](/images/exploring-ios-backup/SQLCipher encryption.png)

This clearly shows that the db is encrypted. Later we will see that not only is the DB encrypted, but every file is also encrypted with its own random per-file encryption key.

### Decrypting the Manifest.db file

The basic decryption process is as follows:

1. Decode the keybag stored in the `BackupKeyBag` entry of `Manifest.plist`. A high-level overview of this structure is given in the [iOS Security Whitepaper](https://www.apple.com/ca/business-docs/iOS_Security_Guide.pdf). The [iPhone Wiki](http://theiphonewiki.com/wiki/index.php?title=ITunes_Backup#BackupKeyBag) describes the binary format: a 4-byte string type field, a 4-byte big-endian length field, and then the value itself.

   The important values are the PBKDF2 `ITER`ations and `SALT`, the double protection salt `DPSL` and iteration count `DPIC`, and then for each protection `CLS`, the `WPKY` wrapped key.

2. Using the backup password derive a 32-byte key using the correct PBKDF2 salt and number of iterations. First, use a SHA256 round with `DPSL` and `DPIC`, then a SHA1 round with `ITER` and `SALT`.

   Unwrap each wrapped key according to [RFC 3394](http://www.apps.ietf.org/rfc/rfc3394.html).

3. Decrypt the manifest database by pulling the 4-byte protection class and longer key from the `ManifestKey` in `Manifest.plist`, and unwrapping it. You now have a SQLite database with all file metadata.

4. For each file of interest, get the class-encrypted per-file encryption key and protection class code by looking in the `Files.file` database column for a binary plist containing `EncryptionKey` and `ProtectionClass` entries. Strip the initial four-byte length tag from `EncryptionKey` before using.

   Then, derive the final decryption key by unwrapping it with the class key that was unwrapped with the backup password. Then decrypt the file using AES in CBC mode with a zero IV.

Source: [StackOverflow](https://stackoverflow.com/questions/1498342/how-to-decrypt-an-encrypted-apple-itunes-iphone-backup/13793043#13793043)

If protection classes and double protection doesn't make much sense, I would highly recommend reading the [iOS Security Whitepaper](https://www.apple.com/ca/business-docs/iOS_Security_Guide.pdf) from page 12 onwards. It provides details about all of this and why iOS uses these protection classes.

If you don't know what a **Keybag** is, Apple has [decent documentation](https://support.apple.com/guide/security/aside/sec8e00e0dd8/1/web/1):

> A data structure used to store a collection of class keys. Each type (user, device, system, backup, escrow, or iCloud Backup) has the same format.
> 
> A header containing: Version (set to four in iOS 12 or later), Type (system, backup, escrow, or iCloud Backup), Keybag UUID, an HMAC if the keybag is signed, and the method used for wrapping the class keys—tangling with the UID or PBKDF2, along with the salt and iteration count.
> 
> A list of class keys: Key UUID, Class (which file or Keychain Data Protection class), wrapping type (UID-derived key only; UID-derived key and passcode-derived key), wrapped class key, and a public key for asymmetric classes.

We can read the `Manifest.plist` file in Python using the [`biplist`](https://bitbucket.org/wooster/biplist/src/master/) module. You can install it using `pip`:

```
pip install biplist
```

And then use it like this:

```python
from biplist import readPlist
import os

backup_directory = os.path.expanduser("~/Library/Application Support/MobileSync/Backup/<unique_id>")
plist_path = os.path.join(backup_directory, "Manifest.plist")
plist = readPlist("Manifest.plist")
```

**Note:** Don't forget to replace `<unique_id>` with the name of you particular device backup folder.

This is what the `plist` contents would look like: 

![Manifest.plist](/images/exploring-ios-backup/image-20220423162825355.png)

From this dict, we require the `backupKeyBag` and `ManifestKey`. It will help us decrypt the `Manifest.db` file. The `BackupKeybag` is a binary string with the following format:

- 4-byte block identifier
- 4-byte block length (most significant byte first), length 4 means total block length of 0xC bytes.
- data

The first block is "VERS" with a version number of 3. There are a lot of block types: VERS, TYPE, UUID, HMCK, WRAP, SALT, ITER, UUID, CLAS, WRAP, KTYP, WPKY, etc.

Source: [IPhone Wiki](https://www.theiphonewiki.com/wiki/ITunes_Backup#BackupKeyBag)

### Decrypting the keybag 

There are quite a few resources available online that show you how you can decrypt the keybag. It uses PBKDF2 for key generation and AES for encryption. You can take a look at [this StackOverflow answer](https://stackoverflow.com/a/13793043) for working Python code to decrypt the keybag. I will be making use of the code from that answer.

There are a bunch of different protection classes. The one used for the manifest database is class 3. We can find this by reading the first 4 bytes of the `ManifestKey` value in our `Manifest.plist` file:

```python
import struct
manifest_class = struct.unpack('<l', plist['ManifestKey'][:4])[0]
# Output: 3
```

I encrypted my iOS backup. This is beneficial because Apple doesn't back up sensitive data unless the backup is encrypted. Sensitive data includes stuff like WiFi passwords. Now we can use the code from StackOverflow, the initial backup encryption passphrase you used while creating the backup, and the rest of the ManifestKey from the `Manifest.plist` to decrypt the `Manifest.db` file:

```python
manifest_key = plist['ManifestKey'][4:]

kb = Keybag(plist['BackupKeyBag'])
kb.unlockWithPassphrase('passphrase')
key = kb.unwrapKeyForClass(manifest_class, manifest_key)

with open('Manifest.db', 'rb') as f:
    encrypted_db = f.read()

decrypted_data = AESdecryptCBC(encrypted_db, key)

with open('decrypted_manifest.db', 'wb') as f:
    f.write(decrypted_data)
```

As you can see above, if you don't remember the passphrase you used while backing up your iOS device, you can not decrypt anything. It is necessary to continue the rest of the decryption process.

Now if we try to open the `decrypted_manifest.db` in a SQL viewer we can see the actual data:

![decrypted manifest.plist](/images/exploring-ios-backup/decrypted-manifest.png)

We can search for all files associated with WhatsApp by doing a global search for WhatsApp. The chats are stored in a `ChatStorage.sqlite` file:

![whatsapp-manifest-plist](/images/exploring-ios-backup/whatsapp-manifest-plist.png)

We can get this record using Python:

```python
import sqlite3

db_conn = sqlite3.connect('decrypted_manifest.db')
relative_path = "Chatstorage.sqlite"
query = """
    SELECT fileID, file
    FROM Files
    WHERE relativePath = ?
    ORDER BY domain, relativePath
    LIMIT 1;
"""
cur = db_conn.cursor()
cur.execute(query, (relative_path,))
result = cur.fetchone()
file_id, file_bplist = result
```

One thing to note is that the `fileID` is made up of a hash of the domain + file name so it would probably be the same for you. It is generated like this:

```
import hashlib

domain = "AppDomainGroup-group.net.whatsapp.WhatsApp.shared"
relative_path = "ChatStorage.sqlite"
hash = hashlib.sha1(f"{domain}-{relative_path}".encode()).hexdigest()

# hash = 7c7fba66680ef796b916b067077cc246adacf01d
```

The record in the db contains the binary plist file associated with `ChatStorage.sqlite` file. We got a hold of that by running the above query. We can take a look inside by using the `readPlistFromString` method of the `biplist` module and extract the required information:

```python
from biplist import readPlistFromString
file_plist = readPlistFromString(file_bplist)

# print(file_plist)

# {'$archiver': 'NSKeyedArchiver',
#  '$objects': ['$null',
#               {'$class': Uid(5),
#                'Birth': 1617036196,
#                'EncryptionKey': Uid(3),
#                'Flags': 0,
#                'GroupID': 501,
#                'InodeNumber': 45839007,
#                'LastModified': 1650483880,
#                'LastStatusChange': 1650481761,
#                'Mode': 33188,
#                'ProtectionClass': 3,
#                'RelativePath': Uid(2),
#                'Size': 22056960,
#                'UserID': 501},
#               'ChatStorage.sqlite',
#               {'$class': Uid(4),
#                'NS.data': b'\x03\x00\x00\x00tE1\xd1H\n"e\x06\xf7\x1cl'
#                           b'\x82\xed\x05\xe7\x1d\x1c\xd6\x97\x0e\xe9\x8b"'
#                           b'\xfa\x16\x93\x9c3\x18\xbe\n\x14\x1eR;f\x98\xe3v'},
#               {'$classes': ['NSMutableData', 'NSData', 'NSObject'],
#                '$classname': 'NSMutableData'},
#               {'$classes': ['MBFile', 'NSObject'], '$classname': 'MBFile'}],
#  '$top': {'root': Uid(1)},
#  '$version': 100000}
```

```python
file_data = file_plist['$objects'][file_plist['$top']['root'].integer]
protection_class = file_data['ProtectionClass']

encryption_key = file_plist['$objects'][file_data['EncryptionKey'].integer]['NS.data'][4:]

# file_data
# {'$class': Uid(5),
#  'Birth': 1617036196,
#  'EncryptionKey': Uid(3),
#  'Flags': 0,
#  'GroupID': 501,
#  'InodeNumber': 45839007,
#  'LastModified': 1650483880,
#  'LastStatusChange': 1650481761,
#  'Mode': 33188,
#  'ProtectionClass': 3,
#  'RelativePath': Uid(2),
#  'Size': 22056960,
#  'UserID': 501}

# protection_class
# 3

# encryption_key
# ---truncated---
```

Now we need to use the keybag class (`kb`) to unwrap the encryption key from above for the specified protection class (3):

```python
file_decryption_key = kb.unwrapKeyForClass(protection_class, encryption_key)
```

### Decrypting ChatStorage.sqlite

Sweet! All that is left is to decrypt the actual chat db. But where is it stored? Apple stores files in the backup folder in a predictable format. It puts them in a subdirectory with the name starting with the first two characters of fileID (eg `7c/7c7fba66680ef796b916b067077cc246adacf01d`). We can get the full path to the chat db file like this:

```python
filename_in_backup = os.path.join(backup_directory, file_id[:2], file_id)
```

This will allow us to open the encrypted file and decrypt it using the `file_decryption_key` we extracted above:

```python
with open(filename_in_backup, 'rb') as encrypted_file:
    encrypted_data = encrypted_file.read()

decrypted_data = AESdecryptCBC(encrypted_data, file_decryption_key)
```

**Note:** This `AESdecryptCBC` function is a part of the code we got from StackOverflow

Sometimes the encryption introduces padding at the end of the data to make it a multiple of the blocksize. So we need to make sure we remove any padding from the end of the data as well:

```python
def removePadding(data, blocksize=16):
    n = int(data[-1])  # RFC 1423: last byte contains number of padding bytes.
    if n > blocksize or n > len(data):
        raise Exception('Invalid CBC padding')
    return data[:-n]
    
decrypted_data = removePadding(decrypted_data)
```

We can save this decrypted data in a new SQLite file:

```python
with open('decrypted_ChatStorage.sqlite', 'wb') as f:
    f.write(decrypted_data)
```

If we now open this new file in a SQLite browser, we can see all the tables:

![WhatsApp Messages Table](/images/exploring-ios-backup/whatsapp-messages-table.png)

The chats are stored in the `ZWAMESSAGE` table:

![WhatsApp Messages](/images/exploring-ios-backup/whatsapp-messages.png)

If you are looking for all the media files that were sent with messages, you will have to go back to the decrypted `Manifest.db` file and filter for media files stored under `Message/Media`:

![media manifest.plist](/images/exploring-ios-backup/media-manifest-plist.png)

You can use the following SQL query to get all of these media files:

```python
"""
SELECT fileID,
       relativePath,
       flags,
       file
FROM Files
WHERE relativePath
    LIKE 'Message/Media/%'
"""
```

Now here comes the best part. You don't have to do any of this yourself. There is already a Python program out there that can parse through your iOS backup, download all the media files, chats, and contact list, and convert them into HTML format. This way you can read your chats without porting the backup into a WhatsApp client.

[Whatsapp-Chat-Exporter](https://github.com/KnugiHK/Whatsapp-Chat-Exporter) works with iOS and Android :sparkles:

I used this tool to eventually convert all of my WhatsApp messages into HTML format for easy browsing on my laptop.

### Useful Resources

I took some help from a bunch of different sources while writing this article. You can go through them to get a deeper understanding of some of the stuff mentioned in this article:

- [Reverse Engineering the iOS Backup](https://www.richinfante.com/2017/3/16/reverse-engineering-the-ios-backup) - Contains a detailed listing of all the different files in the backup folder and what they contain
- [StackOverflow: How to decrypt an encrypted Apple iTunes iPhone backup?](https://stackoverflow.com/a/13793043) - This answer contains all the information required to successfully write a decryption program for iOS backups
- [iphone-backup-decrypt](https://github.com/KnugiHK/iphone_backup_decrypt) - A Python tool that can decrypt a local iOS backup and help you extract files from it. This is based on the SO answer above
- [Whatsapp-Chat-Exporter](https://github.com/KnugiHK/Whatsapp-Chat-Exporter) - A Python tool based on `iphone-backup-decrypt` that can extract WhatsApp data from iOS backup and convert it into HTML files for reading without the WhatsApp client

### Conclusion

I hope you learned a thing or two from this article. I had a fun time diving into the weeds of iOS backups. I had no idea how Apple was storing the backup and how easy/hard it was going to be to get the particular file I wanted from that backup. Suffice to say it wasn't too hard and taught me a few fun things in the process. 