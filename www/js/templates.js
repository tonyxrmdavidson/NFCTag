MustacheTemplates = {};

MustacheTemplates.members = [
"<div data-role='page' id='allMembers'  class='allMembers'>",
    "<div data-role='header' data-add-back-btn='true' data-position='fixed' id='mentorList' data-theme='a'>",
        "<a href='#homepage' class='ui-btn ui-icon-arrow-l ui-btn-icon-left'>Home</a>",
        "<h1>Members</h1>",
        "<span id='spanCount' class='ui-li-count'>{{isIn}}</span>",
    "</div><!-- /header-->",
	"<div role='main' class='ui-content'>",
        "<ul data-role='listview' id='allMembersList' class='ui-listview' data-filter='true' data-hidedividers='false' data-filter-placeholder='Search members...' data-inset='true' data-icon='false'>",
            "{{#groups}}",
                "{{#list}}",
                    "<li data-role='list-divider' id='mentors-{{group}}' data-theme='a'><h2>Mentors {{group}}<h2></li>",
                    "{{#mentors}}",
                        "<li id='{{memberId}}' class='listMember' data-theme='c'>",
                            "<a href='#'>",
                                "<div class='completed ui-li-aside mentor'><div id='status{{memberId}}' style='width:100%;background-color:#ff0000;'></div></div>",
                                "<h3>{{name}}</h3>",
                                "<h3>{{memberId}}-{{group}}</h3>",
                            "</a>",
                        "</li>",
                    "{{/mentors}}",
                    "<li data-role='list-divider' id='ninjas-{{group}}' data-theme='a'><h2>Ninjas {{group}}</h2></li>",
                    "{{#ninjas}}",
                        "<li id='{{memberId}}' class='listMember' data-theme='c'>",
                            "<a href='#'>",
                                "<div class='completed ui-li-aside ninja'><div id='status{{memberId}}' style='width:100%;background-color:red;'></div></div>",
                                "<h3>{{name}}</h3>",
                                "<h3>{{memberId}}-{{group}}</h3>",
                            "</a>",
                        "</li>",
                    "{{/ninjas}}",
                "{{/list}}",
             "{{/groups}}",
        "</ul>",
    "</div>",
    "<div align='center' data-role='footer' id='members-footer' data-position='fixed' data-theme='a'>",
        "<div align='center' data-role='navbar'>",
            "<a href='#homepage'>",
               "<img src='img/logo.png' style='margin: 0 auto; display: block;' />",
            "</a>",
        "</div>",
    "</div>",
"</div>",
].join("\n");

//MustacheTemplates.groups = [
//
//].join("\n");
//
//MustacheTemplates.registrations = [
//
//].join("\n");