var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

const { exec } = require("child_process");

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) throw err;
            var oldpath = files.filetoupload.path;
            var newpath = '/home/in/' + files.filetoupload.name;
            fs.copyFile(oldpath, newpath, function (err) {
                if (err) {
                    res.end(JSON.stringify({ status: 'error', message: `fs copy file error: ${err}` }));
                    return;
                }
                if (!fields.sDEVICE || !fields.dpi || !fields.sCompression || !fields.sOutputFileName || !fields.sInputFileName) {
                    res.end(JSON.stringify({ status: 'error', message: 'fields missing' }));
                    return;
                }
                if (fields.sDEVICE == '' || fields.dpi == '' || fields.sCompression == '' || fields.sOutputFileName == '' || fields.sInputFileName == '') {
                    res.end(JSON.stringify({ status: 'error', message: 'fields missing' }));
                    return;
                }
                console.log(fields)

                // sample: gs -q -dSAFER -dBATCH -dNOPAUSE -sDEVICE=tiffgray -r300 -sCompression=lzw -sOutputFile=/home/out/Proposal20201123012244.tiff /home/in/Proposal20201123012244.pdf -c quit
                exec(`gs -q -dSAFER -dBATCH -dNOPAUSE -sDEVICE=${fields.sDEVICE} -r${fields.dpi} -sCompression=${fields.sCompression} -sOutputFile=/home/out/${fields.sOutputFileName}.tiff /home/in/${fields.sInputFileName}.pdf -c quit`, (err, stdout, stderr) => {
                    if (err) {
                        res.end(JSON.stringify({ status: 'error', message: `command execution error: ${err}` }));
                        return;
                    }
                    if (stderr) {
                        res.end(JSON.stringify({ status: 'error', message: `stderr: ${stderr}` }));
                        return;
                    }
                    res.end(JSON.stringify({ status: 'success', message: `${stdout}` }));
                    return;
                });
            });
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="text" name="sDEVICE" placeholder="sDEVICE"><br>');
        res.write('<input type="text" name="dpi" placeholder="dpi"><br>');
        res.write('<input type="text" name="sCompression" placeholder="sCompression"><br>');
        res.write('<input type="text" name="sOutputFileName" placeholder="sOutputFileName"><br>');
        res.write('<input type="text" name="sInputFileName" placeholder="sInputFileName"><br>');

        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8080);
