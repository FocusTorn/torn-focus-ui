

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer'); // Import Puppeteer

async function generateHTML() {
    try {
        const iconsDir = path.join(__dirname, '..', 'png_icons', 'file_icons_png');
        const files = fs.readdirSync(iconsDir);


        let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>File Icons</title>
        <style>
          table {
            /*width: 100px;*/      /* Adjusted for 10 columns (40px * 5 + 90px * 5) */
            background-color: #090a0c;
            color: #EEEEEE;
            margin: 0;
            padding: 0;

            /* border: 1px solid #dededf;
            border-collapse: collapse;
            border-spacing: 1px; */

          }

          th {
            font-size: 14px;
            font-family: Arial, Helvetica, sans-serif;

            padding: 5px;

            /* border: 1px solid #333; */
          }

          td {

            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;

            padding: 5px;

            /* border: 1px solid #333; */
          }


          /* Icon columns */
          th:nth-child(odd), td:nth-child(odd) {
            text-align: center;
            width: 16px;
          }


          /* Name columns */
          th:nth-child(even), td:nth-child(even) {
            text-align: left;
            width: 150px;
          }
        </style>
      </head>
      <body style="background-color: #090a0c; margin: 20; padding: 0;">
        <h1 style="color: #EEEEEE; text-align: center;">File Icons</h1> <table>
          <thead>
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Icon</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
    `;


        // Calculate the number of rows needed
        const numRows = Math.ceil(files.length / 5); // Adjusted for 10 columns

        let fileIndex = 0;
        for (let row = 0; row < numRows; row++) {
            htmlContent += '<tr>';
            for (let col = 0; col < 10; col += 2) { // Increment by 2 to handle icon/name pairs
                if (fileIndex < files.length) {
                    const file = files[fileIndex];
                    const iconName = path.parse(file).name;
                    htmlContent += `
            <td>
              <img src="${path.join('./', 'file_icons_png', file)}" alt="${iconName}" title="${iconName}">
            </td>
            <td>${iconName}</td>
          `;
                    fileIndex++;
                } else {
                    // Add empty cells for both icon and name columns
                    htmlContent += '<td></td><td></td>';
                }
            }
            htmlContent += '</tr>';
        }

        htmlContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;

        const outputDir = path.join(__dirname, '..', 'png_icons', 'file_icons.html');
        fs.writeFileSync(outputDir, htmlContent);

        console.log('HTML file generated successfully: file_icons.html');



        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();


            // Load the generated HTML file
            await page.goto(`file://${outputDir}`);

            // Select the table element
            const tableElement = await page.$('table');

            // Take a screenshot of the table element
            await tableElement.screenshot({
                path: path.join(__dirname, '..', 'png_icons', 'file_icons_table.png')
            });

            console.log('Table screenshot saved successfully: file_icons_table.png');

            await browser.close();
        } catch (screenshotError) {
            console.error('Error capturing screenshot:', screenshotError);
        }















    } catch (error) {
        console.error('Error generating HTML:', error);
    }
}

generateHTML();






















/*

Can you help me write a script that


////////////////////////////////////////////////////////////////////
////  IconPreview HTML generator
////////////////////////////////////////////////////////////////////










//-----------------------------------------------------------------


Can we modify this script to output the icon columns at 40px wide and the name columns at 90px wide


//-----------------------------------------------------------------


Can we add the following to this script :
- make it 10 columns with headers

The header would look like this

 Icon |       Name       | Icon |       Name       | Icon |       Name       | Icon |       Name       | Icon |       Name       |

 In the icon columns have the img tag, and then in the name column the file name with not extension


//-----------------------------------------------------------------


generates an HTML file that has a table:

    with no padding or margin on the exterior of the table
    table has a bg of 1c242a and a font color of #EEEEEE
    no headers
    no visable borders
    5 colums wide and a total width of 600px
    rows are auto generated  in a loop based on the file icons in path.join(__dirname, '..', 'png_icons','file_icons_png');
    Each cell in that loop will have an image tag containing the png icon









*/













// const fs = require('fs');
// const path = require('path');

// async function generateHTML() {
//   try {
//     const iconsDir = path.join(__dirname, '..', 'png_icons', 'file_icons_png');
//     const files = fs.readdirSync(iconsDir);




//     let htmlContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>File Icons</title>
//         <style>
//           table {
//             width: 600px;
//             background-color: #1c242a;
//             color: #EEEEEE;
//             border-collapse: collapse; /* Collapse borders for no spacing */
//             margin: 0;
//             padding: 0;
//           }

//           td {
//             width: 120px; /* 600px / 5 columns = 120px per column */
//             text-align: center;
//             padding: 10;
//             border: none; /* No visible borders */
//           }

//         /*
//           img {
//             width: 16px;
//             height: 16px;
//           }

//         */

//          </style>
//       </head>
//       <body style="background-color: #1c242a; margin: 0; padding: 0;">
//         <table>




//           <tbody>
//     `;

//     // Calculate the number of rows needed
//     const numRows = Math.ceil(files.length / 5);

//     let fileIndex = 0;
//     for (let row = 0; row < numRows; row++) {
//       htmlContent += '<tr>';
//       for (let col = 0; col < 5; col++) {
//         if (fileIndex < files.length) {
//           const file = files[fileIndex];
//           const iconName = path.parse(file).name;
//           htmlContent += `
//             <td>
//               <img src="${path.join('./', 'file_icons_png', file)}" alt="${iconName}" title="${iconName}">
//             </td>
//           `;
//           fileIndex++;
//         } else {
//           // Add empty cells if there are fewer icons than cells in the last row
//           htmlContent += '<td></td>';
//         }
//       }
//       htmlContent += '</tr>';
//     }

//     htmlContent += `
//           </tbody>
//         </table>
//       </body>
//       </html>
//     `;

//     const outputDir = path.join(__dirname, '..', 'png_icons', 'file_icons.html');
//     fs.writeFileSync(outputDir, htmlContent);

//     console.log('HTML file generated successfully: file_icons.html');

//   } catch (error) {
//     console.error('Error generating HTML:', error);
//   }
// }

// generateHTML();












