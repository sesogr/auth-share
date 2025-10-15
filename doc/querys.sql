--USER Hydration Query
SELECT displayname AS username,
CONCAT(`UserCredentials`.username , ':' , `UserCredentials`.password) AS credentials,
`Users_Services`.dbservice_id,
`Users_Groups`.dbgroup_id,
`Invitations`.receiver_reference
FROM Users
LEFT JOIN Users_Groups ON Users_Groups.dbuser_id = Users.id
LEFT JOIN `Users_Services` ON `Users_Services`.dbuser_id=`Users`.id
LEFT JOIN `UserCredentials`ON `UserCredentials`.dbuser_id=`Users`.id
--CONCAT for multiple Columnes
LEFT JOIN `Invitations` ON `Invitations`.receiver_reference=`Users`.id
--GROUP CONCAT for multiple Lines --> obj_reference and sender_reference
--Spalten und Zeilen zusammenfügen `Invitations`
WHERE Users.id = 'f3c83cc0-f1b4-4db3-84f2-2da15183aaf9'
LIMIT 100

--GROUP TODO
--SERVICE TODO