<?php

try {
    $base64_model = $_POST['file'] ?? null;

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($base64_model)) {
        // Remove the data URL prefix
        $base64String = preg_replace('/^data:model\/gltf\+json;base64,/', '', $base64_model);
    
        // Decode the Base64 string
        $binaryData = base64_decode($base64String);
        if ($binaryData === false) {
            die('Base64 decoding failed');
        }
    
        // Set the upload directory
        $uploadDir = getcwd() . '/uploads';
        // Ensure the directory exists
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
    
        // Generate a unique filename
        $filename = 'model_' . time() . uniqid('cyber-fox') . '.glb';

        if (isset($_POST['filename'])) $filename = filter_var($_POST['filename'], FILTER_SANITIZE_STRING);

        $filePath = $uploadDir . '/' . $filename;
        $baseUrl = theme_get_current_url() . '/uploads/' . $filename;
    
        // Open the file for writing (this will create the file if it doesn't exist)
        $fileHandle = fopen($filePath, 'w');
    
        if ($fileHandle) {
            fwrite($fileHandle, $binaryData);
            fclose($fileHandle);
            echo json_encode([ 'success' => true, 'url' => $baseUrl, 'filename' => $filename ]);
        } else {
            echo json_encode([ 'success' => false, 'error' => "Failed to save the file." ]);
        }
    } else {
        echo json_encode([ 'success' => false, 'error' => "Invalid request." ]);
    }
} catch (\Throwable $th) {
    echo json_encode([ 'success' => false, 'error' => $th ]);
}

function theme_get_current_url() {
    $scriptDirPath = __DIR__;

    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $baseUrl = $protocol . '://' . $host . dirname($_SERVER['SCRIPT_NAME']);
    
    return $baseUrl;
}

?>
