import { ExpressServer } from '@/bin/server';
import { main } from '@/bin/entryPoint';

function bootstrap() {
    const server = new ExpressServer();
    server.setViewPath('./dist/web/');

    server.start();
    main();
}

bootstrap();