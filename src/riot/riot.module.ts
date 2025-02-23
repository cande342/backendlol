import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { RiotService } from './riot.service';

@Module({
    imports: [HttpModule.register({})],
    providers: [RiotService],
    exports: [RiotService],

})
export class RiotModule {}
