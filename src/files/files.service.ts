import { Injectable } from '@nestjs/common';
import { FileResponse } from './interfaces/file-response.interface';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FilesService {


    async saveFile(file: Express.Multer.File): Promise<FileResponse> { // юзаем fs-extra для упрощения работы с файловой системой
        const typeFolder = file.mimetype.split('/')[0]
        const dateFolder = format(new Date(), 'yyyy-MM-dd'); // из date-fns
		const uploadFolder = `${path}/uploads/${typeFolder}/${dateFolder}`; // юзаем app-roth-path для корректного поиска всего приложения для любой операционки
		await ensureDir(uploadFolder);
		
		await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
		const res: FileResponse = { url: `/uploads/${typeFolder}/${dateFolder}/${file.originalname}`};
		
		return res;
    }


}
