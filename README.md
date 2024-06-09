# Sklep Internetowy MASI

Sklep Internetowy MASI to aplikacja e-commerce napisana w Angularze, umożliwiająca użytkownikom przeglądanie produktów, dodawanie ich do koszyka oraz składanie zamówień. Administratorzy mają możliwość zarządzania produktami, w tym dodawania, edytowania i usuwania produktów.

## Technologie

- **Angular**: Framework do budowy aplikacji webowych.
- **Angular Material**: Biblioteka komponentów UI dla Angulara.
- **Tailwind CSS**: Narzędzie do budowy nowoczesnych interfejsów użytkownika.
- **RxJS**: Biblioteka do programowania reaktywnego.
- **TypeScript**: Superset języka JavaScript, dodający statyczne typowanie.

## Wymagania

- Node.js (wersja 14.x lub nowsza)
- npm (wersja 6.x lub nowsza) lub yarn (wersja 1.x lub nowsza)
- Angular CLI (wersja 12.x lub nowsza)

## Instalacja

1. Sklonuj repozytorium:

    ```bash
    git clone https://github.com/Yukinevv/masi-sklep-frontend.git
    cd masi-sklep-frontend
    ```

2. Zainstaluj zależności:

    ```bash
    npm install
    ```

    lub

    ```bash
    yarn install
    ```

## Uruchomienie projektu

Aby uruchomić projekt lokalnie, użyj następującej komendy:

```bash
ng serve
```

Aplikacja będzie dostępna pod adresem http://localhost:4200.

## Struktura projektu

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/
│   │   ├── product-details/
│   │   ├── product-list/
│   │   └── ...
│   ├── modules/
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── ...
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   └── ...
│   ├── app.component.html
│   ├── app.component.ts
│   └── ...
├── assets/
├── environments/
├── styles.css
└── ...
```

# Testowanie

## Testy jednostkowe

Aby uruchomić testy jednostkowe, użyj następującej komendy:

```bash
ng test
```

## Testy end-to-end

Aby uruchomić testy end-to-end, użyj następującej komendy:

```bash
ng e2e
```

## Budowanie

Aby zbudować projekt do produkcji, użyj następującej komendy:

```bash
ng build --prod
```

Wynik budowania będzie znajdował się w katalogu dist/.

## Stylizacja

Projekt używa Angular Material i Tailwind CSS do stylizacji komponentów. Tailwind CSS jest skonfigurowany w pliku tailwind.config.js, a style są importowane w pliku styles.css.

## Zarządzanie stanem

Projekt używa RxJS do zarządzania stanem aplikacji i obsługi strumieni danych.

## Konfiguracja

Pliki konfiguracyjne znajdują się w katalogu environments/. Używaj environment.ts dla konfiguracji deweloperskiej i environment.prod.ts dla konfiguracji produkcyjnej.

## Autorzy

Adrian Rodzic - Frontend Developer - https://github.com/Yukinevv
Filip Krawczak - Backend Developer - https://github.com/krawatklad
