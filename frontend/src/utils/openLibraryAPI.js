/**
 * API de Open Library para buscar información de libros
 * Una sola función: buscar datos de libros por título, autor o ISBN
 */

/**
 * Busca un libro en Open Library por título, autor o ISBN
 * @param {string} query - Término de búsqueda (título, autor o ISBN)
 * @param {string} searchType - Tipo de búsqueda: 'title', 'author', 'isbn'
 * @returns {Promise<Object|null>} - Datos del libro encontrado o null si no se encuentra
 */
export async function searchBook(query, searchType = 'title') {
  try {
    if (!query || query.trim() === '') {
      throw new Error('El término de búsqueda no puede estar vacío');
    }

    let searchUrl = '';
    let response;

    switch (searchType) {
      case 'isbn':
        // Búsqueda por ISBN usando la API de libros
        searchUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${query}&format=json&jscmd=data`;
        response = await fetch(searchUrl);
        const isbnData = await response.json();
        
        if (isbnData[`ISBN:${query}`]) {
          return formatBookData(isbnData[`ISBN:${query}`]);
        }
        return null;

      case 'author':
        // Búsqueda por autor
        searchUrl = `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}&limit=1`;
        response = await fetch(searchUrl);
        const authorData = await response.json();
        
        if (authorData.docs && authorData.docs.length > 0) {
          return formatBookData(authorData.docs[0]);
        }
        return null;

      case 'title':
      default:
        // Búsqueda por título (por defecto)
        searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=1`;
        response = await fetch(searchUrl);
        const titleData = await response.json();
        
        if (titleData.docs && titleData.docs.length > 0) {
          return formatBookData(titleData.docs[0]);
        }
        return null;
    }
  } catch (error) {
    console.error('Error al buscar libro en Open Library:', error);
    throw new Error(`Error al buscar el libro: ${error.message}`);
  }
}

/**
 * Formatea los datos del libro de Open Library al formato de nuestra aplicación
 * @param {Object} bookData - Datos del libro de Open Library
 * @returns {Object} - Datos formateados para nuestra aplicación
 */
function formatBookData(bookData) {
  try {
    // Extraer ISBN (puede venir en diferentes formatos)
    let isbn = '';
    if (bookData.isbn) {
      isbn = Array.isArray(bookData.isbn) ? bookData.isbn[0] : bookData.isbn;
    } else if (bookData.isbn_13) {
      isbn = Array.isArray(bookData.isbn_13) ? bookData.isbn_13[0] : bookData.isbn_13;
    } else if (bookData.isbn_10) {
      isbn = Array.isArray(bookData.isbn_10) ? bookData.isbn_10[0] : bookData.isbn_10;
    }

    // Extraer autor (puede ser string o array)
    let autor = '';
    if (bookData.author_name) {
      autor = Array.isArray(bookData.author_name) ? bookData.author_name.join(', ') : bookData.author_name;
    } else if (bookData.authors && bookData.authors.length > 0) {
      autor = bookData.authors.map(author => author.name || author).join(', ');
    }

    // Extraer editorial
    let editorial = '';
    if (bookData.publisher) {
      editorial = Array.isArray(bookData.publisher) ? bookData.publisher[0] : bookData.publisher;
    }

    // Extraer año de publicación
    let anioPublicacion = '';
    if (bookData.first_publish_year) {
      anioPublicacion = bookData.first_publish_year.toString();
    } else if (bookData.publish_year) {
      anioPublicacion = Array.isArray(bookData.publish_year) 
        ? bookData.publish_year[0].toString() 
        : bookData.publish_year.toString();
    }

    // Extraer categorías/subject
    let categoria = '';
    if (bookData.subject) {
      categoria = Array.isArray(bookData.subject) ? bookData.subject[0] : bookData.subject;
    }

    // Crear descripción
    let descripcion = '';
    if (bookData.first_sentence) {
      descripcion = Array.isArray(bookData.first_sentence) 
        ? bookData.first_sentence[0] 
        : bookData.first_sentence;
    }

    return {
      titulo: bookData.title || '',
      autor: autor,
      isbn: isbn,
      categoria: categoria,
      editorial: editorial,
      anioPublicacion: anioPublicacion,
      descripcion: descripcion,
      // Campos adicionales que podrían ser útiles
      portadaUrl: bookData.cover?.medium || bookData.cover?.large || '',
      idioma: bookData.language || '',
      paginas: bookData.number_of_pages || null
    };
  } catch (error) {
    console.error('Error al formatear datos del libro:', error);
    throw new Error('Error al procesar los datos del libro');
  }
}

/**
 * Busca automáticamente un libro por título (función principal)
 * @param {string} titulo - Título del libro a buscar
 * @returns {Promise<Object|null>} - Datos del libro encontrado
 */
export async function buscarLibroPorTitulo(titulo) {
  return await searchBook(titulo, 'title');
}

/**
 * Busca automáticamente un libro por ISBN
 * @param {string} isbn - ISBN del libro a buscar
 * @returns {Promise<Object|null>} - Datos del libro encontrado
 */
export async function buscarLibroPorISBN(isbn) {
  return await searchBook(isbn, 'isbn');
}

/**
 * Busca automáticamente un libro por autor
 * @param {string} autor - Autor del libro a buscar
 * @returns {Promise<Object|null>} - Datos del libro encontrado
 */
export async function buscarLibroPorAutor(autor) {
  return await searchBook(autor, 'author');
}
