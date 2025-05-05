const JsonFileUpload = document.getElementById('JsonfileUpload');
const SideQuesList = document.getElementById('listOfAllQuestion');
const body = document.body

let UploadedQuesList = JSON.parse(localStorage.getItem('UploadedQuesList')) || [];
let userAnswers = []; // Stores user selected option index (null if skipped)
let jsonData = null;


function renderThumbnailQuestion(indx, title, examTime, totalQues, uploadDate, id) {
    const quesItem = document.createElement('div');
    quesItem.classList.add('questionItem');
    quesItem.dataset.id = id;

    quesItem.innerHTML = `
        <p class="questionSerialNumber">${indx}</p>
        <div class="questionTitle">
            <p class="title">${title}</p>
            <div class="QuestionUtil">
                <div style="display: flex; flex-direction: row; align-items: flex-end;">
                    <!-- SVG icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 32">
                        <path
                                            d="M 16 4 C 9.382813 4 4 9.382813 4 16 C 4 22.617188 9.382813 28 16 28 C 22.617188 28 28 22.617188 28 16 C 28 9.382813 22.617188 4 16 4 Z M 14.96875 6.0625 C 14.980469 6.0625 14.988281 6.0625 15 6.0625 C 15.035156 6.585938 15.46875 7 16 7 C 16.53125 7 16.964844 6.585938 17 6.0625 C 21.738281 6.527344 25.472656 10.261719 25.9375 15 C 25.414063 15.035156 25 15.46875 25 16 C 25 16.53125 25.414063 16.964844 25.9375 17 C 25.472656 21.738281 21.738281 25.472656 17 25.9375 C 16.964844 25.414063 16.53125 25 16 25 C 15.46875 25 15.035156 25.414063 15 25.9375 C 10.261719 25.472656 6.527344 21.738281 6.0625 17 C 6.585938 16.964844 7 16.53125 7 16 C 7 15.46875 6.585938 15.035156 6.0625 15 C 6.527344 10.269531 10.246094 6.539063 14.96875 6.0625 Z M 15 9 L 15 16.40625 L 15.28125 16.71875 L 19.28125 20.71875 L 20.71875 19.28125 L 17 15.5625 L 17 9 Z">
                                        </path>
                    </svg>
                    <p>${examTime}</p>
                </div>
                <p>Total Ques: ${totalQues}</p>
                <p>Upload: ${uploadDate}</p>
            </div>
        </div>
        <div class="menue kebabMenuIcon">&#8942;</div>
        <div class="kebabMenuShow hidden">
            <p>Take Exam</p>
            <p>Shuffle Ques. & Exam</p>
            <p class='showWithAnswer'>Show with Answers</p>
            <p class='deleteThumbnailQuestion'>Delete</p>
        </div>
    `;

    SideQuesList.append(quesItem);

    // Kebab menu logic
    const kebabIcon = quesItem.querySelector('.kebabMenuIcon');
    const menu = quesItem.querySelector('.kebabMenuShow');
    kebabIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.kebabMenuShow').forEach(m => {
            if (m !== menu) m.classList.add('hidden');
        });
        menu.classList.toggle('hidden');
    });
    menu.addEventListener('click', (e) => e.stopPropagation());

    // Delete button
    const deleteButton = quesItem.querySelector('.deleteThumbnailQuestion');
    deleteButton.addEventListener('click', () => {
        UploadedQuesList = UploadedQuesList.filter(q => q.id !== id);
        localStorage.setItem('UploadedQuesList', JSON.stringify(UploadedQuesList));
        quesItem.remove();
        ShowToast('Deleted', 'Item Removed')
    });

    const ShowWithAns = quesItem.querySelector('.showWithAnswer');
    ShowWithAns.addEventListener('click' , () => {
        console.log('clicked');
        ShowWithAnswer();
        
    })


    // Inside renderThumbnailQuestion, after appending quesItem:
    quesItem.addEventListener('click', () => {
        const quizData = UploadedQuesList.find(q => q.id === id);
        if (quizData) loadQuestionsFromJSON(quizData);
    });





}

document.addEventListener('click', () => {
    document.querySelectorAll('.kebabMenuShow').forEach(menu => {
        menu.classList.add('hidden');
    });
});

JsonFileUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const parsed = JSON.parse(e.target.result);
            const id = Date.now().toString();
            const uploadDate = new Date().toLocaleDateString('en-GB');
            const totalQues = parsed.list?.ques?.length || 0;

            parsed.id = id;
            parsed.uploadDate = uploadDate;

            UploadedQuesList.push(parsed);
            localStorage.setItem('UploadedQuesList', JSON.stringify(UploadedQuesList));
            ShowToast('Uploaded', `Your ${parsed.Title} file is Upload and Save!`);

            renderThumbnailQuestion(
                UploadedQuesList.length,
                parsed.Title,
                parsed.Time,
                totalQues,
                uploadDate,
                id
            );
        } catch (err) {
            alert('Invalid JSON file');
            console.error(err);
        }
    };
    reader.readAsText(file);
});

window.addEventListener('DOMContentLoaded', () => {
    UploadedQuesList.forEach((ques, index) => {
        renderThumbnailQuestion(
            index + 1,
            ques.Title,
            ques.Time,
            ques.list?.ques?.length || 0,
            ques.uploadDate,
            ques.id
        );
    });
});


function ShowToast(message, description) {




    const ToastCard = document.createElement('div')
    ToastCard.classList.add('Toastcard')

    ToastCard.innerHTML = `
    
    
        <svg class="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
            fill-opacity="1"
          ></path>
        </svg>
      
        <div class="icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            stroke-width="0"
            fill="currentColor"
            stroke="currentColor"
            class="icon"
          >
            <path
              d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"
            ></path>
          </svg>
        </div>
        <div class="message-text-container">
          <p class="message-text">${message}</p>
          <p class="sub-text">${description}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 15 15"
          stroke-width="0"
          fill="none"
          stroke="currentColor"
          class="cross-icon"
        >
          <path
            fill="currentColor"
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          ></path>
        </svg>
      

    `

    ToastCard.querySelector('.cross-icon').addEventListener('click', () => {
        ToastCard.style.opacity = '0';
        ToastCard.style.transform = 'translateX(20px)';
        setTimeout(() => {
            ToastCard.remove()
        }, 500)
    })


    body.append(ToastCard);

    setTimeout(() => {
        ToastCard.style.opacity = '0';
        ToastCard.style.transform = 'translateX(20px)';
        setTimeout(() => {
            ToastCard.remove()
        }, 500)
    }, 6000);

}


function loadQuestionsFromJSON(loadedJSON) {


    jsonData = loadedJSON;
    const rightSide = document.getElementById('right-side') 
    const questionListContainer = document.querySelector('.QuestionList');
    questionListContainer.innerHTML = ''; // Clear any previous content

    const examHeader = `
        <div class="examHeader">
            <svg xmlns="http://www.w3.org/2000/svg" id="collapse-LeftIcon" height="25px" viewBox="0 -960 960 960" width="25px"><path d="M432-240 192-480l240-240 51 51-189 189 189 189-51 51Zm285 0L477-480l240-240 51 51-189 189 189 189-51 51Z"/></svg>
            <h2>${jsonData.Title}</h2>
            <p>${jsonData.Description}</p>
            <div class="info">
                <p>Time: ${jsonData.Time}</p>
                <p>Marks: ${jsonData.marksPerQues} × ${jsonData.list.ques.length} = ${jsonData.marksPerQues * jsonData.list.ques.length}</p>
            </div>

            <div id="draggable-container">
                            <div class="elegant-timer">
                                <svg class="timer-ring" viewBox="0 0 200 200">
                                    <circle class="ring-bg" cx="100" cy="100" r="90" />
                                    <circle class="ring-fill" cx="100" cy="100" r="90" />
                                </svg>
                                <div class="timer-text" id="timer-label">00</div>
                            </div>
                        </div>

                        <div class="startBtnWrap">
                <button id="startExamBtn">Start Exam</button>
            </div>

        </div>
    `;
    questionListContainer.insertAdjacentHTML('beforeend', examHeader);
    initDraggableTimer(jsonData.Time, showResultBoard);


    const collapseLeftIcon = document.getElementById('collapse-LeftIcon');

    collapseLeftIcon.addEventListener('click', () => {
        const leftSide = document.getElementById('left-side');
        leftSide.classList.toggle('collapsed');

        document.getElementById('right-side').style.width = '80%'
        // Toggle icon rotation and position
        collapseLeftIcon.classList.toggle('rotated');
    });



    document.getElementById('startExamBtn').addEventListener('click', () => {






        jsonData.list.ques.forEach((q, index) => {
            const eachQ = document.createElement('div');
            eachQ.classList.add('eachQuestionItem');

            const tooltipHTML = `

            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
                                viewBox="0 0 80 80">
                                <path
                                    d="M 40 7 C 27.308594 7 17 17.308594 17 30 C 17 37.285156 20.195313 41.851563 23.25 45.289063 C 24.78125 47.007813 26.269531 48.472656 27.328125 49.871094 C 28.386719 51.265625 29 52.535156 29 54 L 29 64 C 29 66.75 31.25 69 34 69 L 35.101563 69 C 35.570313 71.273438 37.59375 73 40 73 C 42.40625 73 44.429688 71.273438 44.898438 69 L 46 69 C 48.75 69 51 66.75 51 64 L 51 54 C 51 52.535156 51.613281 51.265625 52.671875 49.871094 C 53.730469 48.472656 55.21875 47.007813 56.75 45.289063 C 59.804688 41.851563 63 37.285156 63 30 C 63 17.308594 52.691406 7 40 7 Z M 40 9 C 51.609375 9 61 18.390625 61 30 C 61 36.714844 58.195313 40.648438 55.25 43.960938 C 53.78125 45.617188 52.269531 47.089844 51.078125 48.660156 C 49.886719 50.234375 49 51.964844 49 54 L 49 55 L 44 55 L 44 34.796875 C 45.707031 34.339844 47 32.84375 47 31 C 47 28.800781 45.199219 27 43 27 C 41.789063 27 40.734375 27.578125 40 28.4375 C 39.265625 27.578125 38.210938 27 37 27 C 34.800781 27 33 28.800781 33 31 C 33 32.84375 34.292969 34.339844 36 34.796875 L 36 55 L 31 55 L 31 54 C 31 51.964844 30.113281 50.234375 28.921875 48.660156 C 27.730469 47.089844 26.21875 45.617188 24.75 43.960938 C 21.804688 40.648438 19 36.714844 19 30 C 19 18.390625 28.390625 9 40 9 Z M 40 12 C 39.449219 12 39 12.449219 39 13 C 39 13.550781 39.449219 14 40 14 C 40.550781 14 41 13.550781 41 13 C 41 12.449219 40.550781 12 40 12 Z M 35.640625 12.578125 C 35.539063 12.578125 35.4375 12.585938 35.34375 12.613281 C 34.808594 12.757813 34.492188 13.304688 34.636719 13.839844 C 34.777344 14.371094 35.324219 14.6875 35.859375 14.546875 C 36.394531 14.402344 36.710938 13.855469 36.566406 13.320313 C 36.453125 12.898438 36.078125 12.597656 35.640625 12.578125 Z M 44.390625 12.578125 C 43.941406 12.582031 43.550781 12.886719 43.433594 13.320313 C 43.289063 13.855469 43.605469 14.402344 44.140625 14.546875 C 44.675781 14.6875 45.222656 14.371094 45.363281 13.839844 C 45.507813 13.304688 45.191406 12.757813 44.65625 12.613281 C 44.570313 12.589844 44.480469 12.578125 44.390625 12.578125 Z M 31.476563 14.277344 C 31.308594 14.28125 31.144531 14.328125 31 14.410156 C 30.523438 14.6875 30.355469 15.300781 30.632813 15.777344 C 30.765625 16.007813 30.984375 16.175781 31.242188 16.246094 C 31.496094 16.3125 31.769531 16.277344 32 16.144531 C 32.230469 16.011719 32.398438 15.792969 32.464844 15.535156 C 32.535156 15.28125 32.5 15.007813 32.363281 14.777344 C 32.183594 14.460938 31.84375 14.269531 31.476563 14.277344 Z M 48.453125 14.28125 C 48.109375 14.296875 47.800781 14.484375 47.632813 14.78125 C 47.355469 15.257813 47.523438 15.867188 48 16.144531 C 48.476563 16.421875 49.089844 16.257813 49.363281 15.78125 C 49.5 15.550781 49.535156 15.277344 49.464844 15.019531 C 49.398438 14.761719 49.230469 14.542969 49 14.410156 C 48.832031 14.316406 48.644531 14.269531 48.453125 14.28125 Z M 52.035156 16.980469 C 51.765625 16.972656 51.503906 17.078125 51.3125 17.269531 C 50.921875 17.660156 50.921875 18.296875 51.3125 18.6875 C 51.703125 19.074219 52.335938 19.074219 52.726563 18.6875 C 53.117188 18.296875 53.117188 17.660156 52.726563 17.269531 C 52.542969 17.085938 52.296875 16.984375 52.035156 16.980469 Z M 27.996094 16.980469 C 27.722656 16.976563 27.460938 17.082031 27.269531 17.273438 C 26.882813 17.664063 26.882813 18.296875 27.269531 18.6875 C 27.660156 19.078125 28.296875 19.078125 28.6875 18.6875 C 29.074219 18.296875 29.074219 17.664063 28.6875 17.273438 C 28.5 17.089844 28.253906 16.984375 27.996094 16.980469 Z M 54.699219 20.5 C 54.53125 20.503906 54.367188 20.550781 54.21875 20.632813 C 53.992188 20.765625 53.824219 20.984375 53.753906 21.242188 C 53.6875 21.496094 53.722656 21.769531 53.855469 22 C 54.132813 22.476563 54.742188 22.640625 55.21875 22.363281 C 55.699219 22.089844 55.863281 21.476563 55.585938 21 C 55.402344 20.683594 55.0625 20.492188 54.699219 20.5 Z M 25.230469 20.5 C 24.890625 20.519531 24.582031 20.707031 24.410156 21 C 24.136719 21.476563 24.300781 22.089844 24.777344 22.363281 C 25.007813 22.5 25.28125 22.535156 25.535156 22.464844 C 25.792969 22.398438 26.011719 22.230469 26.144531 22 C 26.421875 21.523438 26.253906 20.910156 25.777344 20.636719 C 25.613281 20.539063 25.421875 20.492188 25.230469 20.5 Z M 23.570313 24.601563 C 23.121094 24.605469 22.730469 24.90625 22.613281 25.34375 C 22.46875 25.875 22.785156 26.421875 23.320313 26.566406 C 23.855469 26.710938 24.402344 26.394531 24.546875 25.859375 C 24.6875 25.324219 24.371094 24.777344 23.839844 24.636719 C 23.75 24.613281 23.660156 24.601563 23.570313 24.601563 Z M 56.457031 24.601563 C 56.359375 24.597656 56.257813 24.609375 56.160156 24.636719 C 55.628906 24.777344 55.3125 25.324219 55.453125 25.859375 C 55.597656 26.394531 56.144531 26.710938 56.679688 26.566406 C 57.214844 26.421875 57.53125 25.875 57.386719 25.34375 C 57.273438 24.917969 56.898438 24.617188 56.457031 24.601563 Z M 23 29 C 22.449219 29 22 29.449219 22 30 C 22 30.550781 22.449219 31 23 31 C 23.550781 31 24 30.550781 24 30 C 24 29.449219 23.550781 29 23 29 Z M 37 29 C 38.117188 29 39 29.882813 39 31 L 41 31 C 41 29.882813 41.882813 29 43 29 C 44.117188 29 45 29.882813 45 31 C 45 32.117188 44.117188 33 43 33 L 42 33 L 42 55 L 38 55 L 38 33 L 37 33 C 35.882813 33 35 32.117188 35 31 C 35 29.882813 35.882813 29 37 29 Z M 57 29 C 56.449219 29 56 29.449219 56 30 C 56 30.550781 56.449219 31 57 31 C 57.550781 31 58 30.550781 58 30 C 58 29.449219 57.550781 29 57 29 Z M 23.617188 33.402344 C 23.515625 33.398438 23.417969 33.410156 23.320313 33.4375 C 22.785156 33.578125 22.46875 34.125 22.613281 34.660156 C 22.757813 35.195313 23.304688 35.511719 23.839844 35.367188 C 24.371094 35.222656 24.6875 34.675781 24.546875 34.140625 C 24.433594 33.71875 24.054688 33.417969 23.617188 33.402344 Z M 56.410156 33.402344 C 55.964844 33.40625 55.570313 33.707031 55.453125 34.140625 C 55.3125 34.675781 55.628906 35.222656 56.160156 35.367188 C 56.695313 35.511719 57.242188 35.195313 57.386719 34.660156 C 57.53125 34.125 57.214844 33.578125 56.679688 33.4375 C 56.59375 33.414063 56.503906 33.402344 56.410156 33.402344 Z M 25.253906 37.5 C 25.085938 37.503906 24.921875 37.546875 24.777344 37.632813 C 24.300781 37.910156 24.136719 38.519531 24.410156 39 C 24.6875 39.476563 25.300781 39.640625 25.777344 39.363281 C 26.007813 39.234375 26.175781 39.015625 26.246094 38.757813 C 26.3125 38.5 26.277344 38.226563 26.144531 38 C 25.960938 37.679688 25.621094 37.488281 25.253906 37.5 Z M 54.671875 37.503906 C 54.335938 37.519531 54.027344 37.707031 53.855469 38 C 53.578125 38.480469 53.742188 39.089844 54.21875 39.367188 C 54.699219 39.644531 55.308594 39.480469 55.585938 39 C 55.863281 38.523438 55.699219 37.914063 55.21875 37.636719 C 55.054688 37.539063 54.863281 37.496094 54.671875 37.503906 Z M 27.996094 41.019531 C 27.722656 41.015625 27.460938 41.121094 27.269531 41.3125 C 26.882813 41.703125 26.882813 42.339844 27.269531 42.730469 C 27.660156 43.117188 28.296875 43.117188 28.6875 42.730469 C 29.074219 42.339844 29.074219 41.703125 28.6875 41.3125 C 28.5 41.128906 28.253906 41.027344 27.996094 41.019531 Z M 52.035156 41.019531 C 51.765625 41.015625 51.503906 41.121094 51.3125 41.3125 C 50.921875 41.703125 50.921875 42.339844 51.3125 42.730469 C 51.703125 43.117188 52.335938 43.117188 52.726563 42.730469 C 52.914063 42.539063 53.019531 42.285156 53.019531 42.019531 C 53.019531 41.753906 52.914063 41.5 52.726563 41.3125 C 52.542969 41.128906 52.292969 41.023438 52.035156 41.019531 Z M 31 57 L 49 57 L 49 59 L 37 59 L 37 61 L 49 61 L 49 63 L 37 63 L 37 65 L 48.816406 65 C 48.410156 66.167969 47.316406 67 46 67 L 34 67 C 32.683594 67 31.589844 66.167969 31.183594 65 L 35 65 L 35 63 L 31 63 L 31 61 L 35 61 L 35 59 L 31 59 Z M 37.183594 69 L 42.816406 69 C 42.410156 70.167969 41.316406 71 40 71 C 38.683594 71 37.589844 70.167969 37.183594 69 Z">
                                    </path>
                            </svg>
                            
                            <div class="tooltip">
                            <div class="tooltip-box">
                            <div class="tooltip-header">
                            <div class="tooltip-icon">
                            <svg viewBox="0 0 20 20" fill="currentColor" class="icon-small">
                                                <path
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                    fill-rule="evenodd" clip-rule="evenodd"></path>
                                                    </svg>
                                                    </div>
                                                    <h3 class="tooltip-title">Tips</h3>
                                                    </div>
                                                    <div class="tooltip-body">
                        <p class="tooltip-text">${q.tips || ''}</p>
                        <div class="tooltip-footer">
                            <svg viewBox="0 0 20 20" fill="currentColor" class="icon-small">
                                                <path
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                fill-rule="evenodd" clip-rule="evenodd"></path>
                                                </svg>
                            <span>ExamGenius</span>
                        </div>
                    </div>
                    <div class="tooltip-blur-layer"></div>
                    <div class="tooltip-caret"></div>
                    </div>
                    </div>
                    `;

            const optionsHTML = q.options.map((opt, optIndex) => `
                    <div class="Options" data-id="${optIndex}">${String.fromCharCode(65 + optIndex)}. ${opt}</div>
                    `).join('');

            eachQ.innerHTML = `
            <div class="headOfQues">
            <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
            <p>${index + 1}.</p>
            <h2>${q.quesTitle}</h2>
                </div>
                ${tooltipHTML}
                </div>
                <div class="quesMainMCQ">
                ${optionsHTML}
                </div>
                `;

            // Append question
            questionListContainer.append(eachQ);

            

            
            // Add logic: disable other options on select
            document.querySelectorAll('.eachQuestionItem').forEach((question, index) => {
                const options = question.querySelectorAll('.Options');
                let answered = false;
            
                options.forEach((opt, optIndex) => {
                    userAnswers[index] = null; // initialize with null
            
                    opt.addEventListener('click', () => {
                        if (answered) return;
            
                        options.forEach(o => o.disabled = true); // disable all options in this question
                        opt.classList.add('selected');           // highlight selected
                        answered = true;                         // mark this question as answered
                        userAnswers[index] = optIndex;           // store user's answer
                    });
                });
            });
            
            
            
            
            
            
        });
    
        
        const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Exam';
    submitButton.id = 'submitExamBtn';
    questionListContainer.appendChild(submitButton);

    // Submit button event listener
    submitButton.addEventListener('click', () => {
        // Call the function to process answers and show results
        showResultBoard();
    });


    
    })
    

}

// Function to extract and convert time to seconds
function parseTimeString(timeStr) {
    timeStr = timeStr.trim().toLowerCase();

    let totalSeconds = 0;

    const minMatch = timeStr.match(/(\d+)\s*min/);
    const secMatch = timeStr.match(/(\d+)\s*sec/);

    if (minMatch) {
        totalSeconds += parseInt(minMatch[1]) * 60;
    }

    if (secMatch) {
        totalSeconds += parseInt(secMatch[1]);
    }

    return totalSeconds;
}


// Function to format time in mm:ss format
function formatTime(seconds) {
    if (seconds < 60) {
        return seconds.toString(); // just seconds
    } else {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    }
}

// Countdown timer function
function startTimer(durationInSec, displayEl) {
    let timeLeft = durationInSec;

    const interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);
            displayEl.textContent = "Time's up!";
        } else {
            displayEl.textContent = formatTime(timeLeft);
            timeLeft--;
        }
    }, 1000);
}

function formatTime(seconds) {
    if (seconds < 60) {
        return seconds.toString(); // just seconds
    } else {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    }
}


// Draggable functionality for the timer

function initDraggableTimer(rawTimeStr , onTimeUp) {
    const totalTime = parseTimeString(rawTimeStr);
    const dragEl = document.getElementById('draggable-container');
    const label = dragEl.querySelector('#timer-label');
    const circle = dragEl.querySelector('.ring-fill');

    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference}`;
    dragEl.style.left = '100%';
    dragEl.style.top = '-10%';

    let startTime = null;
    let lastRemaining = totalTime;

    // Countdown logic
    function updateProgress(currentTime) {
        if (!startTime) startTime = currentTime;
        const delta = (currentTime - startTime) / 1000;
        const remaining = Math.max(totalTime - delta, 0);
        const percent = remaining / totalTime;
        const offset = circumference * (1 - percent);

        circle.style.strokeDashoffset = offset;

        // Update color and label
        if (percent <= 0.1) {
            circle.style.stroke = 'red';
            label.classList.add('blink');
        } else if (percent <= 0.2) {
            circle.style.stroke = 'orange';
            label.classList.remove('blink');
        } else {
            circle.style.stroke = 'green';
            label.classList.remove('blink');
        }

        const roundedRemaining = Math.ceil(remaining);
        if (roundedRemaining !== lastRemaining) {
            label.textContent = formatTime(roundedRemaining);
            lastRemaining = roundedRemaining;
        }

        if (remaining > 0) {
            requestAnimationFrame(updateProgress);
        } else {
            label.textContent = 'TimesUp!';
            label.style.fontSize = '12px';
            onTimeUp()
            
        }
    }

    // requestAnimationFrame(updateProgress);

    // Drag logic
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    function startDrag(x, y) {
        isDragging = true;
        offsetX = x - dragEl.offsetLeft;
        offsetY = y - dragEl.offsetTop;
    }

    function doDrag(x, y) {
        if (isDragging) {
            dragEl.style.left = `${x - offsetX}px`;
            dragEl.style.top = `${y - offsetY}px`;
        }
    }

    dragEl.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    dragEl.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
    });

    document.addEventListener('mousemove', e => doDrag(e.clientX, e.clientY));
    document.addEventListener('touchmove', e => {
        const touch = e.touches[0];
        doDrag(touch.clientX, touch.clientY);
    });

    document.addEventListener('touchmove', e => {
        if (isDragging) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);

    const startExamBtn = document.getElementById('startExamBtn');
    startExamBtn.addEventListener('click', () => {
        startTimer(totalTime, label);
        requestAnimationFrame(updateProgress);
    });

}


function onTimeUp() {
    console.log("Time's up! Auto-submitting...");
    showResultBoard(); // or whatever logic you want
}



function extractSecondsFromTime(text) {
    const trimmed = text.toLowerCase().trim();
    if (trimmed.includes("min")) {
        const mins = parseInt(trimmed);
        return mins * 60;
    } else {
        return parseInt(trimmed);
    }
}

console.log(userAnswers);



function showResultBoard() {
    const total = jsonData.list.ques.length;
    let correct = 0, wrong = 0, skipped = 0;

    const questionListContainer = document.querySelector('.QuestionList');

    const resultContainer = document.createElement('div');
    resultContainer.classList.add('resultBoard');

    const header = document.createElement('div');
    header.className = 'resultSummary';

    jsonData.list.ques.forEach((q, i) => {
        const userAns = userAnswers[i];
        const correctIndex = q.ansindx;
        const isCorrect = userAns === correctIndex;

        if (userAns === null) skipped++;
        else if (isCorrect) correct++;
        else wrong++;

        const questionDiv = document.createElement('div');
        questionDiv.className = 'resultQuestion';

        let optionsHTML = q.options.map((opt, j) => {
            let className = 'resultOption';

            if (j === userAns && j === correctIndex) className += ' correct';
            else if (j === userAns && j !== correctIndex) className += ' wrong';
            else if (j === correctIndex) className += ' correct-actual';

            return `<div class="${className}">${String.fromCharCode(65 + j)}. ${opt}</div>`;
        }).join('');

        questionDiv.innerHTML = `
            <h3>${i + 1}. ${q.quesTitle}</h3>
            <div class="resultOptions">${optionsHTML}</div>
            <h3>Answer: ${q.options[q.ansindx]}</h3>
        `;

        resultContainer.appendChild(questionDiv);
    });

    header.innerHTML = `
        <h2>Result</h2>
        <p>Score: ${correct}/${total}</p>
        <p>Correct: ${correct}, Wrong: ${wrong}, Skipped: ${skipped}</p>
    `;

    questionListContainer.innerHTML = '';
    questionListContainer.appendChild(header);
    questionListContainer.appendChild(resultContainer);
}


function ShowWithAnswer() {
    const questionListContainer = document.querySelector('.QuestionList');
    questionListContainer.innerHTML = ''; // Clear any previous content

    jsonData.list.ques.forEach((q, i) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'resultQuestion';

        questionDiv.innerHTML = `
            <h3>${i + 1}. ${q.quesTitle}</h3>
            <h3>Answer: ${q.options[q.ansindx]}</h3>
        `;

        questionListContainer.appendChild(questionDiv);
    });
}