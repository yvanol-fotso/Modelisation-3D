<?php
$folderPath = getcwd() . '/uploads';

// Check if the folder exists
if (is_dir($folderPath)) {
    // Get all files in the folder
    $files = glob($folderPath . '/*');

    // Loop through the files and delete each one
    foreach ($files as $file) {
        if (is_file($file)) {
            // Get the file creation time (Unix timestamp)
            $fileCreationTime = filectime($file);

            // Get the current time (Unix timestamp)
            $currentTime = time();

            // Calculate the time difference
            $timeDifference = $currentTime - $fileCreationTime;

            // Check if the file was created more than 15 minutes ago
            if ($timeDifference > 15 * 60) {
                unlink($file); // Delete the file
            }
        }
    }

    echo "All files in the upload folder deleted successfully.";
} else {
    echo "The upload folder does not exist.";
}
?>
