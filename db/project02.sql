CREATE TABLE project02.modelSource
(
	sourceID SERIAL NOT NULL PRIMARY KEY,
	modelSource VARCHAR(255)
);

CREATE TABLE project02.jobStatus
(
	statusID SERIAL NOT NULL PRIMARY KEY,
	jobStatus VARCHAR(255)
);

CREATE TABLE project02.printMaterial
(
	materialID SERIAL NOT NULL PRIMARY KEY,
	printMaterial VARCHAR(10)
);

CREATE TABLE project02.printUse
(
	useID SERIAL NOT NULL PRIMARY KEY,
	printUse VARCHAR(255)
);

CREATE TABLE project02.color
(
	colorID SERIAL NOT NULL PRIMARY KEY,
	color VARCHAR(100)
);

CREATE TABLE project02.users
(
	userID SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(255),
	hashedPassword VARCHAR(255)
);

CREATE TABLE project02.printJob
(
	jobID SERIAL NOT NULL PRIMARY KEY,
	firstName VARCHAR(100) NOT NULL,
	lastName VARCHAR(100) NOT NULL,
	printName VARCHAR(255) NOT NULL,
	sourceID INT NOT NULL REFERENCES project02.modelSource(sourceID),
	useID INT NOT NULL REFERENCES project02.printUse(useID),
	colorID INT NOT NULL REFERENCES project02.color(colorID),
	materialID INT NOT NULL REFERENCES project02.printMaterial(materialID),
	filename VARCHAR(255) NOT NULL,
	driveURL VARCHAR(255) NOT NULL,
	statusID INT NOT NULL REFERENCES project02.jobStatus(statusID),
	statusDate DATE NOT NULL,
	errorMessage TEXT
);


INSERT INTO project02.modelSource(modelSource) VALUES ('I designed it');
INSERT INTO project02.modelSource(modelSource) VALUES ('Remix of something I found online');
INSERT INTO project02.modelSource(modelSource) VALUES ('Someone elses design from online');

INSERT INTO project02.jobStatus(jobStatus) VALUES ('Print job submitted');
INSERT INTO project02.jobStatus(jobStatus) VALUES ('Model sliced');
INSERT INTO project02.jobStatus(jobStatus) VALUES ('Model printing');
INSERT INTO project02.jobStatus(jobStatus) VALUES ('Model printed and ready for pickup');
INSERT INTO project02.jobStatus(jobStatus) VALUES ('Problem with model, fix and resubmit');

INSERT INTO project02.printMaterial(printMaterial) VALUES ('PLA');
INSERT INTO project02.printMaterial(printMaterial) VALUES ('PETG');
INSERT INTO project02.printMaterial(printMaterial) VALUES ('ABS');
INSERT INTO project02.printMaterial(printMaterial) VALUES ('TPU');

INSERT INTO project02.printUse(printUse) VALUES ('Technology class project');
INSERT INTO project02.printUse(printUse) VALUES ('Science fair');
INSERT INTO project02.printUse(printUse) VALUES ('Project for another class');
INSERT INTO project02.printUse(printUse) VALUES ('Other school related project');
INSERT INTO project02.printUse(printUse) VALUES ('Gift for someone else');
INSERT INTO project02.printUse(printUse) VALUES ('Personal use');
INSERT INTO project02.printUse(printUse) VALUES ('Festival of Trees ornament');

INSERT INTO project02.color(color) VALUES ('Black');
INSERT INTO project02.color(color) VALUES ('White');
INSERT INTO project02.color(color) VALUES ('Blue');
INSERT INTO project02.color(color) VALUES ('Green');
INSERT INTO project02.color(color) VALUES ('Yellow');
INSERT INTO project02.color(color) VALUES ('Orange');
INSERT INTO project02.color(color) VALUES ('Purple');
INSERT INTO project02.color(color) VALUES ('Red');
INSERT INTO project02.color(color) VALUES ('Grey');
INSERT INTO project02.color(color) VALUES ('Transparent');
INSERT INTO project02.color(color) VALUES ('Gold');
INSERT INTO project02.color(color) VALUES ('Silver');
INSERT INTO project02.color(color) VALUES ('Bronze');
INSERT INTO project02.color(color) VALUES ('Cosmic Sparkle');

INSERT INTO project02.users(username, hashedPassword) VALUES ('TestUser', 'TestPassword');

INSERT INTO project02.printJob (jobID, firstName, lastName, printName, sourceID, useID, colorID, materialID, filename, driveURL, statusID, statusDate) VALUES ( 1, 'testFirst', 'testLast', 'demoPrint', 1, 1, 1, 1, 'testPrint.stl', 'http://drive.google.com', 1, '23 Nov 2019');
INSERT INTO project02.printJob (jobID, firstName, lastName, printName, sourceID, useID, colorID, materialID, filename, driveURL, statusID, statusDate) VALUES ( 2, 'test2First', 'test2Last', 'demo2Print', 2, 2, 2, 2, 'test2Print.stl', 'http://drive.google.com', 2, '24 Nov 2019');
INSERT INTO project02.printJob (jobID, firstName, lastName, printName, sourceID, useID, colorID, materialID, filename, driveURL, statusID, statusDate) VALUES ( 3, 'newName', 'zebra', 'aDemoPrint', 2, 2, 2, 2, 'test2Print.stl', 'http://drive.google.com', 2, '24 Nov 2019');