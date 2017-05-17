# JavaScript #

Nesta pasta, são armazenadas as classes e funcionalidades utilizadas para desenho e manipulações gráficas.

1. Interface.js

Classe para armazenamento das funções de manipulação da área de desenho. Inclui as ações das ferramentas e comunicação com a interface HTML/CSS.

2. Scene.js

Classe para armazenamento e manipulação da cena atual. Inserem-se e retiram-se polígonos.

3. Polygon.js

Classe Polígono. Possui as funções básicas pertinentes à criação e manipulação de um polígono. Faz uso das classes `Vertex` e `Edge`, além de interagir com a classe Interface.

4. Vertex.js

Classe Vértice. Possui as funções básicas pertinentes à representação de vértices em memória, bem como métodos pertinentes. É manipulada pela classe `Polygon` mãe.

5. Edge.js

Classe Aresta. Nesta, são guardados os atributos e métodos para representação das arestas. É manipulada pela classe `Polygon` mãe.