function search() {
    const query = document.getElementById('searchInput').value;
    const results = document.getElementById('results');
    results.innerHTML = '';

    if (!query.trim()) {
      results.innerHTML = '<p>Please enter a search term</p>';
      return;
    }

    // Create sections for both types of results
    const docSection = document.createElement('div');
    docSection.className = 'results-section';
    docSection.innerHTML = '<h2>Documents</h2><div class="documents-container"></div>';
    results.appendChild(docSection);

    const imgSection = document.createElement('div');
    imgSection.className = 'results-section';
    imgSection.innerHTML = '<h2>Images</h2><div class="image-gallery"></div>';
    results.appendChild(imgSection);

    const documentsContainer = docSection.querySelector('.documents-container');
    const imageGallery = imgSection.querySelector('.image-gallery');

    // Fetch documents first
    fetch(`/api/documents?query=${query}`)
      .then(res => res.json())
      .then(docs => {
        if (docs.length === 0) {
          documentsContainer.innerHTML = '<p>No documents found</p>';
        } else {
          docs.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'document-card';
            card.innerHTML = `
              <div class="document-title">${doc.title || 'Untitled Document'}</div>
              <a href="${doc.url}" class="document-link" target="_blank">View Document</a>
            `;
            documentsContainer.appendChild(card);
          });
        }
      })
      .catch(error => {
        documentsContainer.innerHTML = '<p>Error loading documents</p>';
      });

    // Then fetch images
    fetch(`/api/images?query=${query}`)
      .then(res => res.json())
      .then(images => {
        if (images.length === 0) {
          imageGallery.innerHTML = '<p>No images found</p>';
        } else {
          images.forEach(url => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = url;
            img.alt = query;
            imgContainer.appendChild(img);
            
            imageGallery.appendChild(imgContainer);
          });
        }
      })
      .catch(error => {
        imageGallery.innerHTML = '<p>Error loading images</p>';
      });
  }