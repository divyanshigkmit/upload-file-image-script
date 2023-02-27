const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");

const models = require("./models");

const readingFileAndUpload = async (file1, file2) => {
  // Data entry in employee table
  await readXlsxFile(Buffer.from(file1.buffer)).then(async (rows) => {
    let employeeDetail = [];
    rows.shift();
    rows.forEach((row) => {
      let employee = {
        name: row[0],
        email: row[1],
        slackHandle: row[2],
        dateOfBirth: row[3],
        dateOfJoining: row[4],
        marriageAnniversary: row[5],
      };
      employeeDetail.push(employee);
    });
    await models.Employee.bulkCreate(employeeDetail, {
      ignoreDuplicates: true,
    }).then(() => console.log("Employee data have been saved"));
  });

  // Data entry in employee family table
  await readXlsxFile(Buffer.from(file2.buffer)).then(async (rows) => {
    let employeeFamilyDetail = [];
    rows.shift();
    for (const row of rows) {
      const employeeId = await models.Employee.findOne({
        where: {
          name: row[0],
        },
        attributes: ["id"],
      });
      const employeeFamily = {
        employeeId: employeeId?.dataValues.id || "",
        name: row[1],
        dateOfBirth: row[2],
      };
      employeeFamilyDetail.push(employeeFamily);
    }
    await models.EmployeeFamily.bulkCreate(employeeFamilyDetail, {
      ignoreDuplicates: true,
    }).then(() => console.log("Employee family data have been saved"));
  });
  return;
};

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { files } = req;
    if (files == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    if (files[0].originalname === "employee.xlsx")
      await readingFileAndUpload(files[0], files[1]);
    else await readingFileAndUpload(files[1], files[0]);
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
