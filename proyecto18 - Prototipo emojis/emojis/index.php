<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buscador de Emojis</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 20px;
            background-color: #f9f9f9;
            color: #333;
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 2.5em;
            color: #444;
        }
        #barra-busqueda {
            text-align: center;
            margin-bottom: 30px;
        }
        #barra-busqueda input[type="text"] {
            padding: 10px;
            width: 300px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 1em;
        }
        #barra-busqueda button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #007BFF;
            color: white;
            font-size: 1em;
            cursor: pointer;
        }
        #barra-busqueda button:hover {
            background-color: #0056b3;
        }
        .cuadricula-emojis {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 10px;
            justify-items: center;
        }
        .item-emoji {
            font-size: 2em;
            padding: 15px;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.2s, background-color 0.2s;
        }
        .item-emoji:hover {
            transform: scale(1.1);
            background-color: #f0f0f0;
        }
    </style>
</head>
<body>
    <h1>Buscador de Emojis</h1>
    <div id="barra-busqueda">
        <form method="GET" action="">
            <input type="text" name="busqueda" placeholder="Buscar un emoji..." value="<?php echo htmlspecialchars($_GET['busqueda'] ?? ''); ?>">
            <button type="submit">Buscar</button>
        </form>
    </div>
    <div class="cuadricula-emojis" id="lista-emojis">
        <?php
        // Código PHP para leer y mostrar emojis
        function leerEmojisDesdeCSV($nombreArchivo) {
            $emojis = [];
            if (($gestor = fopen($nombreArchivo, 'r')) !== FALSE) {
                while (($datos = fgetcsv($gestor, 1000, ',')) !== FALSE) {
                    $emojis[$datos[0]] = $datos[1];
                }
                fclose($gestor);
            }
            return $emojis;
        }

        $emojis = leerEmojisDesdeCSV('emojis.csv');
        $terminoBusqueda = $_GET['busqueda'] ?? '';

        foreach ($emojis as $emoji => $nombre) {
            if (empty($terminoBusqueda) || stripos($nombre, $terminoBusqueda) !== false) {
                echo "<div class='item-emoji' title='$nombre' onclick=\"copiarEmoji('$emoji')\">$emoji</div>";
            }
        }
        ?>
    </div>

    <script>
        function copiarEmoji(emoji) {
            navigator.clipboard.writeText(emoji).then(() => {
                alert('¡Emoji copiado al portapapeles!');
            });
        }
    </script>
</body>
</html>

