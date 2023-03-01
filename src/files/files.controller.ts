import { Controller, Get, HttpCode, HttpStatus, Post, Query, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs-extra';
import { join } from 'node:path';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FilesService } from './files.service';
import { FileResponse } from './interfaces/file-response.interface';

@Controller('files')
export class FilesController {

    constructor(private readonly filesService: FilesService) {}



    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file')) // интерсептор для перехвата файлов из мультипарт формы
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileResponse> { // можно сделать для массива файлов, но тут для одного
        return this.filesService.saveFile(file)
    }



    /* Для потоковой передачи видео nodejs должен считывать столько видео, сколько позволяет запрошенное видео.
    Например, если есть видео объемом более 10 Гб, чтение видео займет довольно много времени, и пользователю придется ждать именно столько.
    Однако nodejs — это среда выполнения, разработанная на парадигме управляемого событиями и неблокирующего ввода-вывода.
    Вот почему nodejs имеет очень выгодное преимущество, когда речь идет о сервисах, которые считывают и реагируют на большие файлы, такие как потоковое аудио.
    https://www.imkh.dev/nodejs-video-streaming-server/
    */

    @Get('stream')
    // @HttpCode(206)
    getFile(@Query() query, @Res({ passthrough: true }) res:Response): StreamableFile {
        /* Вся суть в следующей строчке с createReadStream:
        - читает весь файл кусками некоторых размеров (это стриминг называется) и отправляет его клиенту
        - за счет такой передачи клиент будет получать данные быстрее, т.к. не надо ждать, пока загрузится весь файл
        Для лучшего понимания, обычная статическая передача, под капотом которой обычный readFile(скорее всего):
        - загружает файл полностью и отправляет его клиенту
        - данные будут получены медленнее, т.к. передается файл целиком, что особо ощутимо при больших файлах
        */
        const file = createReadStream(join(process.cwd(), query.audio)); 
        res.set({ // меняем тип контента с octet-stream на audio/mpeg
            'Content-Type': 'audio/mpeg', 
            'Content-Disposition': `attachment; filename="${query.audio}"`,
        });
        return new StreamableFile(file);
    }

    


}
