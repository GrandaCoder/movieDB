// Objeto de traducción
var translations = {
  en: {
    selectLanguage: "Select a language!",
    loadMore: "Show more!",
    trends: "Trends",
    favoritesMovies: "Favorites Movies",
    categorys: "Categories",
    noResults: "No results found!",
    author: "2023, Created by Camilo Granda",
    relatedMovies: "Related Movies"
  },
  es: {
    selectLanguage: "Selecciona un idioma!",
    loadMore: "Ver más",
    trends: "Tendencias",
    favoritesMovies: "Películas favoritas",
    categorys: "Categorías",
    noResults: "No se encontraron resultados!",
    author: "2023, Creado por Camilo Granda",
    relatedMovies: "Películas relacionadas"
  },
  zh: {
    selectLanguage: "选择一种语言！",
    loadMore: "显示更多！",
    trends: "趋势",
    favoritesMovies: "收藏电影",
    categorys: "分类",
    noResults: "没有找到结果！",
    author: "2023，由Camilo Granda创建",
    relatedMovies: "相关电影"
  },
  ar: {
    selectLanguage: "اختر لغة!",
    loadMore: "عرض المزيد!",
    trends: "الاتجاهات",
    favoritesMovies: "الأفلام المفضلة",
    categorys: "الفئات",
    noResults: "لم يتم العثور على نتائج!",
    author: "2023، تم إنشاؤه بواسطة Camilo Granda",
    relatedMovies: "الأفلام ذات الصلة"
  },
  pt: {
    selectLanguage: "Selecione um idioma!",
    loadMore: "Mostrar mais!",
    trends: "Tendências",
    favoritesMovies: "Filmes favoritos",
    categorys: "Categorias",
    noResults: "Nenhum resultado encontrado!",
    author: "2023, Criado por Camilo Granda",
    relatedMovies: "Filmes relacionados"
  },
  ru: {
    selectLanguage: "Выберите язык!",
    loadMore: "Показать больше!",
    trends: "Тенденции",
    favoritesMovies: "Любимые фильмы",
    categorys: "Категории",
    noResults: "Результатов не найдено!",
    author: "2023, Создано Camilo Granda",
    relatedMovies: "Связанные фильмы"
  },
  ja: {
    selectLanguage: "言語を選択してください！",
    loadMore: "もっと表示！",
    trends: "トレンド",
    favoritesMovies: "お気に入りの映画",
    categorys: "カテゴリ",
    noResults: "結果が見つかりませんでした！",
    author: "2023年、Camilo Granda作成",
    relatedMovies: "関連する映画"
  }
};



  // Función para obtener la traducción
  function getTranslation(language, key) {
    // Verificar si el idioma está disponible en las traducciones
    if (translations.hasOwnProperty(language)) {
      // Verificar si la clave de traducción existe en el idioma seleccionado
      if (translations[language].hasOwnProperty(key)) {
        return translations[language][key];
      }
    }
    
    // Si no se encuentra la traducción, retornar la clave original
    return key;
  }


  export {getTranslation};