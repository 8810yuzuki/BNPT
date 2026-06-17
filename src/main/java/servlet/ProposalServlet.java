package servlet;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/proposal")
public class ProposalServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws IOException {

        // ① フロントからJSON受け取る
        String body = req.getReader()
                .lines()
                .reduce("", (a, b) -> a + b);

        System.out.println("受信: " + body);

        // ② Nodeへ送る
        try {
            URL url = new URL("http://localhost:3000/send");

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(body.getBytes(StandardCharsets.UTF_8));
            }

            int code = conn.getResponseCode();
            System.out.println("Node応答コード: " + code);

        } catch (Exception e) {
            e.printStackTrace();
        }

        // ③ フロントに返す
        res.setStatus(200);
    }
}