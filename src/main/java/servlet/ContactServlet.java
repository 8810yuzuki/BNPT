package servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/contact")
public class ContactServlet extends HttpServlet {

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {

        StringBuilder body = new StringBuilder();

        BufferedReader reader =
                request.getReader();

        String line;

        while ((line = reader.readLine()) != null) {
            body.append(line);
        }

        System.out.println("お問い合わせ受信");
        System.out.println(body.toString());

        URI uri =
                URI.create("http://localhost:3000/contact");

        HttpURLConnection conn =
                (HttpURLConnection) uri.toURL().openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty(
                "Content-Type",
                "application/json");

        try (OutputStream os =
                conn.getOutputStream()) {

            os.write(
                body.toString().getBytes("UTF-8"));
        }

        conn.getResponseCode();

        response.setStatus(
                HttpServletResponse.SC_OK);
    }
}