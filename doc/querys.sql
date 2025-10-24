--USER Hydration Query
SELECT displayname AS username,
CONCAT(`UserCredentials`.username , ':' , `UserCredentials`.password) AS credentials,
`Users_Services`.dbservice_id,
`Invitations`.receiver_reference,
`Users_Groups`.dbgroup_id
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

SELECT
`Users`.displayname AS username,
CONCAT(UserCredentials.username, ':', '*****') AS credentials,
GROUP_CONCAT(DISTINCT Users_Services.dbservice_id) AS services,
GROUP_CONCAT(DISTINCT Users_Groups.dbgroup_id) AS groups,
GROUP_CONCAT(DISTINCT CONCAT(Invitations.obj_reference, ':', Invitations.sender_reference) SEPARATOR ';') AS invitations
FROM Users
LEFT JOIN Users_Services ON Users_Services.dbuser_id = Users.id
LEFT JOIN Users_Groups ON Users_Groups.dbuser_id = Users.id
LEFT JOIN UserCredentials ON UserCredentials.dbuser_id = Users.id
LEFT JOIN Invitations ON Invitations.receiver_reference = Users.id
LEFT JOIN `IdDisplayname` ON `IdDisplayname`.id=`Users_Services`.dbservice_id
WHERE Users.id = 'b8e8c369-4771-4deb-8f7b-3d0ee3624fa4'
GROUP BY `Users`.displayname, UserCredentials.username
LIMIT 100;

SELECT
*
FROM Users
LEFT JOIN Users_Services ON Users_Services.dbuser_id = Users.id
LEFT JOIN Users_Groups ON Users_Groups.dbuser_id = Users.id
LEFT JOIN UserCredentials ON UserCredentials.dbuser_id = Users.id
LEFT JOIN Invitations ON Invitations.receiver_reference = Users.id
LEFT JOIN `IdDisplayname` AS ServiceMap ON `ServiceMap`.id=`Users_Services`.dbservice_id
LEFT JOIN `IdDisplayname` AS GroupMap ON `GroupMap`.id=`Users_Groups`.dbgroup_id
WHERE Users.id = 'b8e8c369-4771-4deb-8f7b-3d0ee3624fa4'
LIMIT 100;

--GROUP TODO
SELECT groupname,
owner,
id,
`Groups_Services`.id,
`Invitations`.sender_reference AS sentInvites,
`Invitations`.receiver_reference AS receivedInvites,
`Users_Groups`.dbgroup_id
FROM Groups
LEFT JOIN `Groups_Services` ON `Groups_Services`.dbgroup_id=`Groups`.id
LEFT JOIN `Invitations` ON `Invitations`.sender_reference=`Groups`.id
LEFT JOIN `Invitations` ON `Invitations`.receiver_reference=`Groups`.id
LEFT JOIN `Users_Groups` ON `Users_Groups`.dbgroup_id=`Groups`.id
WHERE `Groups`.id = 'cf40e6d0-8bb9-474e-be29-ed901b678c54'

--die 2te

SELECT
groupname,
owner,
`Groups`.id,
Groups_Services.id AS serviceList,
Invitations_Sent.sender_reference AS sentInvites,
Invitations_Recv.receiver_reference AS receivedInvites,
Users_Groups.dbuser_id
FROM Groups
LEFT JOIN Groups_Services ON Groups_Services.dbgroup_id = Groups.id
LEFT JOIN Invitations AS Invitations_Sent ON Invitations_Sent.sender_reference = Groups.id
LEFT JOIN Invitations AS Invitations_Recv ON Invitations_Recv.receiver_reference = Groups.id
LEFT JOIN Users_Groups ON Users_Groups.dbgroup_id = Groups.id
WHERE Groups.id = 'cf40e6d0-8bb9-474e-be29-ed901b678c54'
LIMIT 100;
--SERVICE TODO