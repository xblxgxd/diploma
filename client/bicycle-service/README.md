# Велосервис - Интернет-магазин и сервисный центр

Это приложение для управления интернет-магазином велосипедов и сервисным центром. Включает в себя возможности для покупки велосипедов и комплектующих, а также оформления заявок на ремонт.

## Доступные скрипты

В директории проекта вы можете запустить:

### `npm start`

Запускает приложение в режиме разработки.\
Откройте [http://localhost:3000](http://localhost:3000) чтобы увидеть его в браузере.

Страница будет перезагружаться при внесении изменений.\
Вы также можете увидеть ошибки линтинга в консоли.

## Особенности приложения

### ИИ-ассистент для велосервиса
Приложение включает в себя интеллектуального помощника, который может:
- Отвечать на вопросы о ремонте велосипедов
- Помогать с выбором запчастей
- Объяснять процесс оформления заявки на ремонт
- Рассказывать о сервисных центрах
- Предоставлять информацию об услугах и сроках выполнения работ

ИИ-ассистент доступен на всех страницах приложения (кроме страниц авторизации) через плавающую кнопку чата в правом нижнем углу.

### Функциональность для пользователей
- Просмотр каталога товаров и сервисных центров
- Создание и управление профилем
- Оформление заказов и заявок на ремонт
- Отслеживание статуса заказов и ремонтов
- Оставление отзывов

### Функциональность для сервисных центров
- Управление профилем сервисного центра
- Управление каталогом услуг и компонентов
- Управление заявками на ремонт
- Управление ценами и прайс-листами
- Управление гарантийными случаями

## Настройка ИИ-ассистента

Для настройки ИИ-ассистента необходимо указать параметры в файле `.env`:
- `AI_PROVIDER` - провайдер ИИ (mock, openai, anthropic, google)
- `OPENAI_API_KEY` - API-ключ для OpenAI (если используется)
- `ANTHROPIC_API_KEY` - API-ключ для Anthropic (если используется)
- `GOOGLE_GEMINI_API_KEY` - API-ключ для Google Gemini (если используется)

## Узнать больше

Вы можете узнать больше в [документации Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Чтобы изучить React, посетите [документацию React](https://reactjs.org/).

### Разделение кода

Этот раздел перемещен сюда: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Анализ размера сборки

Этот раздел перемещен сюда: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Создание Progressive Web App

Этот раздел перемещен сюда: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Расширенная конфигурация

Этот раздел перемещен сюда: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Деплоймент

Этот раздел перемещен сюда: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### Ошибка при минификации `npm run build`

Этот раздел перемещен сюда: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
