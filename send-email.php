<?php
header("Content-Type: application/json");

$response = ['success' => false, 'message' => 'Erreur inconnue.'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';

    if (!empty($name) && !empty($email) && !empty($message)) {
        // Assurez-vous que l'email est valide
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Logique d'envoi de l'email
            $to = "contact@sebastien-koenig.fr"; // Remplacez par votre adresse email
            $subject = "Nouveau message de $name";
            $body = "Nom: $name\nEmail: $email\nMessage:\n$message";
            $headers = "From: $email";

            if (mail($to, $subject, $body, $headers)) {
                $response['success'] = true;
                $response['message'] = "Message envoyé avec succès.";
            } else {
                $response['message'] = "Erreur lors de l'envoi de l'email.";
            }
        } else {
            $response['message'] = "Adresse email invalide.";
        }
    } else {
        $response['message'] = "Tous les champs sont obligatoires.";
    }
}

echo json_encode($response);
