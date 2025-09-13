# HTTP basics

GET, POST, status codes 200/404/500...
agagaga

# Promise vs async/await

Promise là object, async/await là syntax sugar...

# Những điều quan trọng về cách làm việc

1. Khi hỏi cần nói theo cách hiểu mình trước, comfirm xem mình hiểu đúng ko? nếu ko phải thì người được hỏi sẽ giải thích

2. Giải thích phải có đầu có đuôi, tránh tình trạng nhào vô hỏi trống không vì nghĩ người khác cũng hiểu giống mình

3. Khi gặp issue khó, nếu làm 45p đến 1h mà ko ra ouput gì thì phải raise lên với lead để tìm hướng giải quyết

4. Khi estimate cần check impact, nếu có chỗ nào khó thì có thể dành 1h để làm thử xem có khả thi không rồi hãy estimate

5. Khi có bug thì cần tìm ra Root cause và fix thì đó mới là kinh nghiệm, tránh tình trạng chơi chiêu fix ẩu

6. Làm xong Test 2 cái:

- Dựa theo requirement để test
- Test impact của nó
  Tránh tình trạng bịa ra các case test

7. QA với khách cần phải có hình minh họa, dùng paint khoanh vùng chỗ cần hỏi => nghệ thuật QA "Tránh để khách hàng suy nghĩ quá nhiều"
   hỏi sao để khách hàng chỉ cần trả lời yes/no, nếu no thì phải tìm giải pháp đề xuất cho họ
   => QA chính là evidance sau này compat với khách :)

8. Nếu khách hàng báo bug thì phải tái hiện được bug, trường hợp bug nằm trên stagging /product thì cần nhờ PM export file .log trên server
   để điều tra

9. Không chỉ làm theo task mà còn suy nghĩ "khách hàng cần gì", "cái này có thực sự giải quyết vấn đề không" để đề xuất solution tốt hơn
   => Vậy thì khách hàng mới happy :)

10. Phải report hằng ngày để lead nắm tình hình.
